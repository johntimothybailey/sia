import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export const SKILL_ROOT = path.resolve(import.meta.dirname, '..');
export const REPO_ROOT = path.resolve(SKILL_ROOT, '..', '..');
export const FIXTURES_ROOT = path.join(SKILL_ROOT, 'fixtures');

export const REQUIRED_SCENARIOS = [
  'stale-import-after-refactor',
  'mutable-default-shared-object-leak',
  'auth-tenant-scoping-omission',
  'date-seconds-vs-ms',
  'stale-cache-key-invalidation',
  'prisma-count-include-filter-drift',
  'missing-migration-for-schema-change',
  'server-action-redirect-before-revalidation',
  'react-stale-closure-suppressed-deps',
  'optimistic-rollback-overwrites-concurrent-mutation',
  'github-actions-path-env-breakage',
  'env-or-secret-leakage',
  'missing-edge-behavior-test',
];

export const REQUIRED_TRIO = [
  'diff.patch',
  'expected-findings.md',
  'false-positive-traps.md',
];

export const REQUIRED_SKILL_HEADINGS = [
  '## Required Review Procedure',
  '## Tool Config Discovery',
  '## CodeRabbit Parity Checks',
  '## Greptile Parity Checks',
  '## Cursor Bugbot Parity Checks',
  '## Deterministic Gate Command Discovery',
  '## Coverage Matrix',
  '## Finding Validation Rubric',
  '## Fixture-Based Regression Harness',
];

export const REQUIRED_SKILL_TOKENS = [
  '.coderabbit.yaml',
  'reviews.path_filters',
  'reviews.path_instructions',
  'reviews.profile',
  'reviews.tools',
  'knowledge_base.code_guidelines',
  '.greptile/config.json',
  '.greptile/rules.md',
  '.greptile/files.json',
  'greptile.json',
  '.cursor/BUGBOT.md',
];

export const REQUIRED_README_TOKENS = [
  'pipeline',
  'harness',
  'local',
  'non-goals',
];

export const ALLOWED_GATE_STATUSES = ['pass', 'fail', 'not run', 'not available'];
export const ALLOWED_CONFIG_COVERAGE_STATUSES = ['loaded', 'skipped', 'unavailable'];
export const REQUIRED_GATE_CATEGORIES = ['typecheck', 'lint', 'tests', 'build', 'static/security'];
export const REQUIRED_CONTEXT_CATEGORIES = ['imports', 'callers', 'tests', 'schemas', 'routes', 'migrations', 'API/contracts', 'CI', 'package scripts'];
export const REQUIRED_CONFIG_COVERAGE_KEYS = ['.cursor/BUGBOT.md', '.greptile/*', 'greptile.json', '.coderabbit.yaml'];

const JSON_BLOCK_RE = /```json\s*([\s\S]*?)```/i;

export function fail(message) {
  throw new Error(message);
}

export function ensure(condition, message) {
  if (!condition) fail(message);
}

export function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

export function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

export function writeJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function relativeTo(fromRoot, targetPath) {
  const rel = path.relative(fromRoot, targetPath) || '.';
  return rel.split(path.sep).join('/');
}

export function listFixtureDirs(fixturesRoot = FIXTURES_ROOT) {
  if (!fs.existsSync(fixturesRoot)) return [];
  return fs
    .readdirSync(fixturesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(fixturesRoot, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

export function extractSection(markdown, heading) {
  const startIndex = markdown.indexOf(heading);
  if (startIndex === -1) return null;
  const afterHeading = markdown.slice(startIndex + heading.length).replace(/^\s*\n/, '');
  const nextHeadingMatch = afterHeading.match(/\n##\s+|\n#\s+/);
  const section = nextHeadingMatch ? afterHeading.slice(0, nextHeadingMatch.index) : afterHeading;
  return section.trim();
}

export function parseJsonSection(markdown, heading) {
  const section = extractSection(markdown, heading);
  ensure(section, `Missing section: ${heading}`);
  const match = section.match(JSON_BLOCK_RE);
  ensure(match?.[1], `Missing JSON code block in ${heading}`);
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    fail(`Invalid JSON in ${heading}: ${error.message}`);
  }
}

export function extractBulletList(markdown, heading) {
  const section = extractSection(markdown, heading);
  ensure(section, `Missing section: ${heading}`);
  return section
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

export function parseFixture(fixtureDir) {
  const expectedPath = path.join(fixtureDir, 'expected-findings.md');
  const trapsPath = path.join(fixtureDir, 'false-positive-traps.md');
  const diffPath = path.join(fixtureDir, 'diff.patch');

  REQUIRED_TRIO.forEach((fileName) => {
    ensure(fs.existsSync(path.join(fixtureDir, fileName)), `Fixture ${path.basename(fixtureDir)} missing ${fileName}`);
  });

  const expectedMarkdown = readText(expectedPath);
  const trapsMarkdown = readText(trapsPath);
  const diffText = readText(diffPath);

  return {
    name: path.basename(fixtureDir),
    dir: fixtureDir,
    expectedPath,
    trapsPath,
    diffPath,
    expectedMarkdown,
    trapsMarkdown,
    diffText,
    findings: parseJsonSection(expectedMarkdown, '## Findings'),
    coverageMatrix: parseJsonSection(expectedMarkdown, '## Coverage Matrix'),
    gateExpectations: parseJsonSection(expectedMarkdown, '## Gate Discovery Expectations'),
    configExpectations: parseJsonSection(expectedMarkdown, '## Config Discovery Expectations'),
    traps: extractBulletList(trapsMarkdown, '## Must not report'),
  };
}

export function parseDiffChangedFiles(diffText) {
  const files = new Set();
  for (const match of diffText.matchAll(/^\+\+\+\s+b\/(.+)$/gm)) {
    if (match[1] !== '/dev/null') files.add(match[1].trim());
  }
  for (const match of diffText.matchAll(/^diff --git a\/(.+?) b\/(.+)$/gm)) {
    if (match[2] !== '/dev/null') files.add(match[2].trim());
  }
  return [...files].sort();
}

export function detectChangedFileTypes(files) {
  const types = new Set();
  for (const file of files) {
    if (file.startsWith('.github/workflows/')) {
      types.add('github-actions');
      continue;
    }
    if (file === 'prisma/schema.prisma' || file.endsWith('.prisma')) {
      types.add('prisma');
      continue;
    }
    if (file.endsWith('BUGBOT.md')) {
      types.add('bugbot-rules');
      continue;
    }
    const ext = path.extname(file).replace(/^\./, '');
    types.add(ext || 'no-extension');
  }
  return [...types].sort();
}

function walkUpDirs(startDir, stopDir) {
  const dirs = [];
  let current = path.resolve(startDir);
  const limit = path.resolve(stopDir);
  while (true) {
    dirs.push(current);
    if (current === limit) break;
    const parent = path.dirname(current);
    if (parent === current || !current.startsWith(limit)) break;
    current = parent;
  }
  return dirs;
}

function findPackageJsons(targetRoot, changedFiles) {
  const packages = new Map();
  const rootPackage = path.join(targetRoot, 'package.json');
  if (fs.existsSync(rootPackage)) packages.set(rootPackage, true);

  const cwdPackage = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(cwdPackage) && process.cwd().startsWith(targetRoot)) {
    packages.set(cwdPackage, true);
  }

  for (const changedFile of changedFiles) {
    const absoluteFile = path.join(targetRoot, changedFile);
    const existingPath = fs.existsSync(absoluteFile) ? absoluteFile : path.dirname(absoluteFile);
    const dirs = walkUpDirs(path.dirname(existingPath), targetRoot);
    for (const dir of dirs) {
      const pkg = path.join(dir, 'package.json');
      if (fs.existsSync(pkg)) packages.set(pkg, true);
      if (dir === targetRoot) break;
    }
  }

  return [...packages.keys()].sort((a, b) => {
    const depth = relativeTo(targetRoot, a).split('/').length - relativeTo(targetRoot, b).split('/').length;
    return depth === 0 ? a.localeCompare(b) : depth;
  });
}

function discoverConfigSignals(targetRoot) {
  const candidates = {
    typescript: ['tsconfig.json', 'tsconfig.base.json'],
    eslint: ['eslint.config.js', 'eslint.config.mjs', '.eslintrc', '.eslintrc.json', '.eslintrc.js'],
    tests: ['vitest.config.ts', 'vitest.config.js', 'jest.config.js', 'jest.config.ts'],
    githubActions: ['.github/workflows'],
    prisma: ['prisma/schema.prisma'],
  };

  const result = {};
  for (const [key, items] of Object.entries(candidates)) {
    result[key] = items.filter((item) => fs.existsSync(path.join(targetRoot, item)));
  }
  return result;
}

function categorizeScript(scriptName, command) {
  const lowerName = scriptName.toLowerCase();
  const lowerCommand = command.toLowerCase();
  if (/\b(audit|security)\b/.test(lowerName)) return 'static/security';
  if (/\bbuild\b/.test(lowerName)) return 'build';
  if (/\blint\b/.test(lowerName)) return 'lint';
  if (/\btest|spec\b/.test(lowerName)) return 'tests';
  if (/\b(typecheck|check-types?|types)\b/.test(lowerName)) return 'typecheck';

  const haystack = `${lowerName} ${lowerCommand}`;
  if (/\b(typecheck|check-types?|tsc|ts:check|types)\b/.test(haystack)) return 'typecheck';
  if (/\b(lint|eslint|markdownlint|remark|stylelint)\b/.test(haystack)) return 'lint';
  if (/\b(test|spec|vitest|jest|playwright|cypress)\b/.test(haystack)) return 'tests';
  if (/\b(build|compile|bundle|pack)\b/.test(haystack)) return 'build';
  if (/\b(audit|security|semgrep|snyk|actionlint|knip|depcheck|prisma validate|validate:prisma|secret)\b/.test(haystack)) return 'static/security';
  return null;
}

export function discoverGateCommands({ targetRoot, changedFiles = [] }) {
  const packageJsons = findPackageJsons(targetRoot, changedFiles);
  const categories = Object.fromEntries(
    REQUIRED_GATE_CATEGORIES.map((category) => [category, { status: 'not available', commands: [], packageScripts: [] }]),
  );

  for (const packageJsonPath of packageJsons) {
    const packageJson = readJson(packageJsonPath);
    const scripts = packageJson.scripts ?? {};
    for (const [name, command] of Object.entries(scripts)) {
      const category = categorizeScript(name, command);
      if (!category) continue;
      const entry = `${relativeTo(targetRoot, packageJsonPath)}#${name}`;
      categories[category].commands.push(command);
      categories[category].packageScripts.push(entry);
      categories[category].status = 'not run';
    }
  }

  for (const category of REQUIRED_GATE_CATEGORIES) {
    categories[category].commands = [...new Set(categories[category].commands)];
    categories[category].packageScripts = [...new Set(categories[category].packageScripts)].sort();
  }

  return {
    targetRoot: relativeTo(targetRoot, targetRoot),
    changedFiles: [...changedFiles].sort(),
    packageJsons: packageJsons.map((pkg) => relativeTo(targetRoot, pkg)),
    configSignals: discoverConfigSignals(targetRoot),
    categories,
  };
}

function parseCodeRabbitFields(raw) {
  const fields = {
    file: '.coderabbit.yaml',
    exists: false,
    reviews: {
      profile: false,
      path_filters: false,
      path_instructions: false,
      tools: false,
    },
    knowledge_base: {
      code_guidelines: false,
    },
    toolConfigs: [],
  };

  if (!raw) return fields;
  fields.exists = true;
  fields.reviews.profile = /reviews:[\s\S]*?profile:/m.test(raw);
  fields.reviews.path_filters = /reviews:[\s\S]*?path_filters:/m.test(raw);
  fields.reviews.path_instructions = /reviews:[\s\S]*?path_instructions:/m.test(raw);
  fields.reviews.tools = /reviews:[\s\S]*?tools:/m.test(raw);
  fields.knowledge_base.code_guidelines = /knowledge_base:[\s\S]*?code_guidelines:/m.test(raw);

  const toolSignals = [
    ['eslint', ['eslint.config.js', 'eslint.config.mjs', '.eslintrc.json']],
    ['markdownlint', ['.markdownlint.jsonc', '.markdownlint.json', '.remarkrc.js']],
    ['actionlint', ['.github/workflows']],
    ['semgrep', ['.semgrep.yml', '.semgrep.yaml']],
  ];

  for (const [toolName, files] of toolSignals) {
    if (new RegExp(`(^|\\s|-)${toolName}(:|\\s|$)`, 'm').test(raw)) {
      fields.toolConfigs.push({
        tool: toolName,
        matchedConfig: files.find((candidate) => fs.existsSync(path.join(this.targetRoot ?? REPO_ROOT, candidate))) ?? null,
      });
    }
  }

  return fields;
}

export function discoverCodeRabbit(targetRoot) {
  const configPath = path.join(targetRoot, '.coderabbit.yaml');
  const raw = fs.existsSync(configPath) ? readText(configPath) : null;
  return parseCodeRabbitFields.call({ targetRoot }, raw);
}

export function discoverGreptile(targetRoot, changedFiles) {
  const relevantDirs = new Map();
  for (const changedFile of changedFiles) {
    const fileDir = path.dirname(path.join(targetRoot, changedFile));
    for (const dir of walkUpDirs(fileDir, targetRoot)) {
      const rel = relativeTo(targetRoot, dir);
      const dotGreptile = path.join(dir, '.greptile');
      const legacy = path.join(dir, 'greptile.json');
      const entry = {
        dir: rel,
        hasDotGreptile: fs.existsSync(dotGreptile),
        files: [],
        hasLegacy: fs.existsSync(legacy),
        precedence: 'none',
      };
      if (entry.hasDotGreptile) {
        ['config.json', 'rules.md', 'files.json'].forEach((fileName) => {
          const filePath = path.join(dotGreptile, fileName);
          if (fs.existsSync(filePath)) entry.files.push(`.greptile/${fileName}`);
        });
      }
      if (entry.hasDotGreptile && entry.hasLegacy) entry.precedence = '.greptile';
      else if (entry.hasDotGreptile) entry.precedence = '.greptile';
      else if (entry.hasLegacy) entry.precedence = 'greptile.json';
      if (entry.hasDotGreptile || entry.hasLegacy) relevantDirs.set(rel, entry);
      if (dir === targetRoot) break;
    }
  }
  return [...relevantDirs.values()].sort((a, b) => a.dir.localeCompare(b.dir));
}

export function discoverCursorBugbot(targetRoot, changedFiles) {
  const files = new Set();
  const rootBugbot = path.join(targetRoot, '.cursor', 'BUGBOT.md');
  if (fs.existsSync(rootBugbot)) files.add('.cursor/BUGBOT.md');

  for (const changedFile of changedFiles) {
    const fileDir = path.dirname(path.join(targetRoot, changedFile));
    for (const dir of walkUpDirs(fileDir, targetRoot)) {
      const bugbot = path.join(dir, '.cursor', 'BUGBOT.md');
      if (fs.existsSync(bugbot)) files.add(relativeTo(targetRoot, bugbot));
      if (dir === targetRoot) break;
    }
  }

  const priorReviewCandidates = [
    'prior-review-comments.md',
    'prior-review-comments.json',
    'prior-review-context.md',
    'prior-review-context.json',
  ];

  const priorReviewContext = priorReviewCandidates.find((candidate) => fs.existsSync(path.join(targetRoot, candidate))) ?? null;

  return {
    bugbotFiles: [...files].sort(),
    priorReviewContext,
  };
}

export function discoverToolConfigs({ targetRoot, changedFiles = [] }) {
  return {
    coderabbit: discoverCodeRabbit(targetRoot),
    greptile: discoverGreptile(targetRoot, changedFiles),
    cursor: discoverCursorBugbot(targetRoot, changedFiles),
  };
}

export function parseCliOptions(argv = process.argv.slice(2)) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[index + 1];
      if (!next || next.startsWith('--')) {
        options[key] = true;
      } else {
        options[key] = next;
        index += 1;
      }
    }
  }
  return options;
}

export function normalizeTargetRoot(targetOption) {
  if (!targetOption) return REPO_ROOT;
  return path.resolve(process.cwd(), targetOption);
}

export function loadChangedFiles({ targetRoot, diffOption, changedFilesOption }) {
  if (changedFilesOption) {
    return changedFilesOption.split(',').map((file) => file.trim()).filter(Boolean).sort();
  }
  if (diffOption) {
    return parseDiffChangedFiles(readText(path.resolve(process.cwd(), diffOption)));
  }
  return [];
}
