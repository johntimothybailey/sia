import path from 'node:path';
import {
  REQUIRED_README_TOKENS,
  REQUIRED_SKILL_HEADINGS,
  REQUIRED_SKILL_TOKENS,
  REPO_ROOT,
  SKILL_ROOT,
  ensure,
  extractSection,
  readText,
} from './shared.mjs';

const skillPath = path.join(SKILL_ROOT, 'SKILL.md');
const readmePath = path.join(SKILL_ROOT, 'README.md');
const contributingPath = path.join(REPO_ROOT, 'CONTRIBUTING.md');
const skill = readText(skillPath);
const readme = readText(readmePath);
const contributing = readText(contributingPath);

REQUIRED_SKILL_HEADINGS.forEach((heading) => {
  ensure(skill.includes(heading), `SKILL.md missing heading: ${heading}`);
});

const procedureSection = extractSection(skill, '## Required Review Procedure');
ensure(procedureSection, 'SKILL.md missing Required Review Procedure section body');
const numberedSteps = procedureSection
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => /^\d+\.\s/.test(line));
ensure(numberedSteps.length >= 8, `SKILL.md expected at least 8 numbered procedure steps, found ${numberedSteps.length}`);

const procedureExpectations = [
  { step: 1, patterns: [/base branch/i, /branch-vs-base diff/i] },
  { step: 2, patterns: [/staged/i, /unstaged|working-tree/i] },
  { step: 3, patterns: [/classify/i, /changed files?/i] },
  { step: 4, patterns: [/reviewer config/i] },
  { step: 5, patterns: [/context graph/i, /imports/i, /callers/i, /tests/i, /schemas/i, /routes/i, /migrations/i, /package scripts?/i] },
  { step: 6, patterns: [/deterministic gates?/i] },
  { step: 7, patterns: [/ordered review passes?/i] },
  { step: 8, patterns: [/validate findings?/i, /coverage matrix/i] },
];

procedureExpectations.forEach(({ step, patterns }) => {
  const line = numberedSteps.find((entry) => entry.startsWith(`${step}.`));
  ensure(line, `SKILL.md missing procedure step ${step}`);
  patterns.forEach((pattern) => {
    ensure(pattern.test(line), `SKILL.md procedure step ${step} missing ${pattern}`);
  });
});

REQUIRED_SKILL_TOKENS.forEach((token) => {
  ensure(skill.includes(token), `SKILL.md missing required token: ${token}`);
});

REQUIRED_README_TOKENS.forEach((token) => {
  ensure(readme.toLowerCase().includes(token.toLowerCase()), `README.md missing required token: ${token}`);
});

const readmeMentionsQodo = /\bqodo\b/i.test(readme);
const readmeNarrowsQodo = /(heuristic inspiration|not parity|non-live parity|local emulation|first pass)/i.test(readme);
ensure(!readmeMentionsQodo || readmeNarrowsQodo, 'README.md mentions Qodo without narrowing its parity claim');

const readmeMentionsPipeline = /(required review procedure|required procedure|explicit pipeline|review pipeline|ordered review procedure)/i.test(readme);
ensure(readmeMentionsPipeline, 'README.md does not describe the explicit pipeline behavior');

const readmeMentionsLocalScope = /(local-only|local emulation|non-live|does not call live services|offline)/i.test(readme);
ensure(readmeMentionsLocalScope, 'README.md does not describe the local/non-live parity scope');

const readmeMentionsNonGoals = /##\s+non-goals/i.test(readme) || /non-goals:/i.test(readme);
ensure(readmeMentionsNonGoals, 'README.md does not document non-goals');

const contributingMentionsCatch22Eval =
  /Catch-22 contributor workflow/i.test(contributing) &&
  /bun run --cwd eval\/skills\/catch-22 test:docs/i.test(contributing) &&
  /bun run --cwd eval\/skills\/catch-22 discover:gates/i.test(contributing) &&
  /bun run --cwd eval\/skills\/catch-22 test:harness/i.test(contributing);
ensure(contributingMentionsCatch22Eval, 'CONTRIBUTING.md does not document the Catch-22 eval workflow');

process.stdout.write(
  `Docs contract OK for ${path.relative(REPO_ROOT, skillPath)}, ${path.relative(REPO_ROOT, readmePath)}, and ${path.relative(REPO_ROOT, contributingPath)}\n`,
);
