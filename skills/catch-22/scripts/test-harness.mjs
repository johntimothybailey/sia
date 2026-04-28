import fs from 'node:fs';
import path from 'node:path';
import {
  ALLOWED_CONFIG_COVERAGE_STATUSES,
  ALLOWED_GATE_STATUSES,
  FIXTURES_ROOT,
  REQUIRED_CONFIG_COVERAGE_KEYS,
  REQUIRED_CONTEXT_CATEGORIES,
  REQUIRED_GATE_CATEGORIES,
  REQUIRED_SCENARIOS,
  REQUIRED_TRIO,
  detectChangedFileTypes,
  discoverGateCommands,
  discoverToolConfigs,
  ensure,
  listFixtureDirs,
  parseDiffChangedFiles,
  parseFixture,
  relativeTo,
} from './shared.mjs';

function assertSubset(actual, expected, label) {
  for (const [key, expectedValue] of Object.entries(expected)) {
    ensure(key in actual, `${label} missing key: ${key}`);
    const actualValue = actual[key];
    if (Array.isArray(expectedValue)) {
      ensure(Array.isArray(actualValue), `${label}.${key} should be an array`);
      ensure(
        JSON.stringify(actualValue) === JSON.stringify(expectedValue),
        `${label}.${key} mismatch. Expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actualValue)}`,
      );
      continue;
    }
    if (expectedValue && typeof expectedValue === 'object') {
      ensure(actualValue && typeof actualValue === 'object', `${label}.${key} should be an object`);
      assertSubset(actualValue, expectedValue, `${label}.${key}`);
      continue;
    }
    ensure(actualValue === expectedValue, `${label}.${key} mismatch. Expected ${expectedValue}, got ${actualValue}`);
  }
}

function deriveExpectedConfigCoverage(configDiscovery) {
  const greptileEntries = Array.isArray(configDiscovery.greptile) ? configDiscovery.greptile : [];
  const hasDotGreptile = greptileEntries.some((entry) => entry.hasDotGreptile);
  const hasLegacyGreptile = greptileEntries.some((entry) => entry.hasLegacy);
  const legacyIsPrimary = greptileEntries.some((entry) => entry.precedence === 'greptile.json');

  return {
    '.cursor/BUGBOT.md': configDiscovery.cursor?.bugbotFiles?.length ? 'loaded' : 'unavailable',
    '.greptile/*': hasDotGreptile ? 'loaded' : 'unavailable',
    'greptile.json': legacyIsPrimary ? 'loaded' : hasLegacyGreptile ? 'skipped' : 'unavailable',
    '.coderabbit.yaml': configDiscovery.coderabbit?.exists ? 'loaded' : 'unavailable',
  };
}

function validateCoverageMatrix(name, coverageMatrix, changedFiles, configDiscovery) {
  ensure(typeof coverageMatrix.branch_diff_reviewed === 'boolean', `${name}: coverage branch_diff_reviewed must be boolean`);
  ensure(typeof coverageMatrix.base_branch === 'string', `${name}: coverage base_branch must be string`);
  ensure(typeof coverageMatrix.working_tree_reviewed === 'boolean', `${name}: coverage working_tree_reviewed must be boolean`);
  ensure(Array.isArray(coverageMatrix.changed_file_types), `${name}: changed_file_types must be an array`);
  ensure(
    JSON.stringify(coverageMatrix.changed_file_types) === JSON.stringify(detectChangedFileTypes(changedFiles)),
    `${name}: changed_file_types mismatch with diff.patch`,
  );

  REQUIRED_CONFIG_COVERAGE_KEYS.forEach((key) => {
    ensure(key in coverageMatrix.config_coverage, `${name}: config_coverage missing ${key}`);
    ensure(
      ALLOWED_CONFIG_COVERAGE_STATUSES.includes(coverageMatrix.config_coverage[key]),
      `${name}: invalid config_coverage status for ${key}: ${coverageMatrix.config_coverage[key]}`,
    );
  });
  assertSubset(coverageMatrix.config_coverage, deriveExpectedConfigCoverage(configDiscovery), `${name}:configCoverage`);

  REQUIRED_GATE_CATEGORIES.forEach((key) => {
    ensure(key in coverageMatrix.deterministic_gates, `${name}: deterministic_gates missing ${key}`);
    ensure(
      ALLOWED_GATE_STATUSES.includes(coverageMatrix.deterministic_gates[key]),
      `${name}: invalid gate status for ${key}: ${coverageMatrix.deterministic_gates[key]}`,
    );
  });

  REQUIRED_CONTEXT_CATEGORIES.forEach((category) => {
    ensure(coverageMatrix.context_inspected.includes(category), `${name}: context_inspected missing ${category}`);
  });

  ensure(
    ['available', 'not available'].includes(coverageMatrix.prior_review_context),
    `${name}: prior_review_context must be available or not available`,
  );
}

function validateFindings(name, findings, traps) {
  ensure(Array.isArray(findings) && findings.length > 0, `${name}: expected at least one finding`);
  findings.forEach((finding, index) => {
    ['title', 'file', 'line', 'failure_path', 'impact', 'tests_or_gates', 'minimal_fix'].forEach((field) => {
      ensure(finding[field], `${name}: finding ${index + 1} missing ${field}`);
    });
  });
  ensure(Array.isArray(traps) && traps.length > 0, `${name}: false-positive traps must contain at least one bullet`);
}

function validateFixtureShape(fixtureDir) {
  const files = fs.readdirSync(fixtureDir);
  REQUIRED_TRIO.forEach((file) => {
    ensure(files.includes(file), `${path.basename(fixtureDir)} missing ${file}`);
  });
}

function validateGateExpectations(name, gateExpectations, targetRoot, changedFiles) {
  const discovery = discoverGateCommands({ targetRoot, changedFiles });
  assertSubset(discovery, gateExpectations, `${name}:gateDiscovery`);
}

function validateConfigExpectations(name, configExpectations, targetRoot, changedFiles) {
  const discovery = discoverToolConfigs({ targetRoot, changedFiles });
  assertSubset(discovery, configExpectations, `${name}:configDiscovery`);
  return discovery;
}

const fixtureDirs = listFixtureDirs(FIXTURES_ROOT);
ensure(fixtureDirs.length === REQUIRED_SCENARIOS.length, `Expected ${REQUIRED_SCENARIOS.length} fixture directories, found ${fixtureDirs.length}`);
ensure(
  JSON.stringify(fixtureDirs.map((dir) => path.basename(dir))) === JSON.stringify([...REQUIRED_SCENARIOS].sort()),
  'Fixture directories do not match required scenario names',
);

for (const fixtureDir of fixtureDirs) {
  validateFixtureShape(fixtureDir);
  const fixture = parseFixture(fixtureDir);
  const changedFiles = parseDiffChangedFiles(fixture.diffText);
  ensure(changedFiles.length > 0, `${fixture.name}: diff.patch must contain at least one changed file`);
  validateFindings(fixture.name, fixture.findings, fixture.traps);

  const contextRoot = path.join(fixtureDir, 'context');
  const targetRoot = fs.existsSync(contextRoot) ? contextRoot : fixtureDir;
  validateGateExpectations(fixture.name, fixture.gateExpectations, targetRoot, changedFiles);
  const configDiscovery = validateConfigExpectations(fixture.name, fixture.configExpectations, targetRoot, changedFiles);
  validateCoverageMatrix(fixture.name, fixture.coverageMatrix, changedFiles, configDiscovery);

  const optionalFiles = fs.readdirSync(fixtureDir).filter((name) => !REQUIRED_TRIO.includes(name));
  optionalFiles.forEach((name) => {
    ensure(name !== 'diff.patch.bak', `${fixture.name}: unexpected backup file left behind`);
  });

  process.stdout.write(`Validated ${relativeTo(FIXTURES_ROOT, fixture.dir)}\n`);
}
