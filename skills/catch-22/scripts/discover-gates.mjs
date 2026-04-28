import process from 'node:process';
import {
  discoverGateCommands,
  discoverToolConfigs,
  loadChangedFiles,
  normalizeTargetRoot,
  parseCliOptions,
  writeJson,
} from './shared.mjs';

const options = parseCliOptions();
const targetRoot = normalizeTargetRoot(options.target);
const changedFiles = loadChangedFiles({
  targetRoot,
  diffOption: options.diff,
  changedFilesOption: options['changed-files'],
});

const result = {
  gateDiscovery: discoverGateCommands({ targetRoot, changedFiles }),
  configDiscovery: discoverToolConfigs({ targetRoot, changedFiles }),
};

process.stdout.write(writeJson(result));
