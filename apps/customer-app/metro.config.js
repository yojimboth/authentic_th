// Metro config for the authentic_th monorepo.
// Ensures Metro can resolve workspace packages under packages/* (e.g. `api-client`,
// `types`) that are npm-workspace-symlinked into the root node_modules rather than
// duplicated inside apps/customer-app/node_modules.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo (so edits to packages/* trigger a rebuild).
config.watchFolders = [workspaceRoot];

// 2. Resolve node_modules from both the app and the workspace root, app-local first.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force a single copy of react/react-native to avoid "invalid hook call" /
//    duplicate-package issues that are common with hoisted monorepo installs.
config.resolver.disableHierarchicalLookup = false;

module.exports = config;
