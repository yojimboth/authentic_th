/**
 * This is an npm workspaces monorepo. `expo`'s "~54.0.0" range floats onto
 * newer patch releases whose peer requirements pull the workspace's single
 * hoisted `react` copy forward (currently 19.2.x), while this app's own
 * package.json still pins production `react` to an exact "19.1.0" — so npm
 * nests a *second*, older `react` copy under apps/customer-app/node_modules
 * for this workspace only, alongside a matching nested `react-test-renderer`.
 *
 * Left to plain Node/Jest resolution, different requirers would end up
 * pinned to different physical `react` copies (e.g. this app's own source
 * resolving the nested 19.1.0 copy, while @testing-library/react-native —
 * hoisted at the repo root — resolves the root 19.2.x copy when it
 * self-checks react/react-test-renderer version parity). Two different
 * React module instances backing the same render silently desync React's
 * internals (dispatcher, the `act()` environment flag, etc.), surfacing as
 * "`render` function has not been called" or a
 * "Incorrect version of react-test-renderer detected" error.
 *
 * This is a JS-only module-resolution issue confined to the Jest run; it
 * does NOT reproduce the native RNCSafeAreaProvider duplicate-registration
 * crash (that required two autolinked *native* module copies at build
 * time — see GlobalSafeWrapper.tsx and the react-native-safe-area-context
 * version alignment in package.json for that fix). We resolve it here, in
 * test config only, by forcing every requirer — regardless of where it
 * physically lives in node_modules — onto the same canonical `react` /
 * `react-test-renderer` pair, rather than changing any production
 * dependency version pin.
 */
const path = require('path');

const monorepoRoot = path.resolve(__dirname, '..', '..');

// Canonical `react`: resolved starting from the monorepo root, so it
// matches whatever @testing-library/react-native (hoisted at the root)
// sees when it self-checks versions.
const canonicalReactDir = path.dirname(
  require.resolve('react/package.json', { paths: [monorepoRoot] }),
);

// Canonical `react-test-renderer`: resolved starting from this app, so it
// matches whichever copy is actually installed for this workspace.
const canonicalTestRendererDir = path.dirname(
  require.resolve('react-test-renderer/package.json', { paths: [__dirname] }),
);

module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '^react$': canonicalReactDir,
    '^react/(.*)$': `${canonicalReactDir}/$1`,
    '^react-test-renderer$': canonicalTestRendererDir,
    '^react-test-renderer/(.*)$': `${canonicalTestRendererDir}/$1`,
  },
};
