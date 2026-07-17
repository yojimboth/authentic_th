/**
 * This is an npm workspaces monorepo. `expo`'s "~54.0.0" range floats onto
 * newer patch releases whose peer requirements pull the workspace's single
 * hoisted `react` copy forward, while this app's own package.json still pins
 * production `react` to an exact version — so npm nests a *second*, older
 * `react` copy under apps/customer-app/node_modules for this workspace only.
 *
 * We resolve it here, in test config only, by forcing every requirer onto
 * the same canonical `react` / `react-test-renderer` pair.
 */
const path = require('path');

const monorepoRoot = path.resolve(__dirname, '..', '..');

const canonicalReactDir = path.dirname(
  require.resolve('react/package.json', { paths: [monorepoRoot] }),
);

const canonicalTestRendererDir = path.dirname(
  require.resolve('react-test-renderer/package.json', { paths: [__dirname] }),
);

module.exports = {
  preset: 'jest-expo',
  moduleNameMapper: {
    '^react$': canonicalReactDir,
    '^react/(.*)$': `${canonicalReactDir}/$1`,
    '^react-test-renderer$': canonicalTestRendererDir,
    '^react-test-renderer/(.*)$': `${canonicalTestRendererDir}/$1`,
  },
};