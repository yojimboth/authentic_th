import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { GlobalSafeWrapper } from './GlobalSafeWrapper';

// Use the library's official Jest mock so <SafeAreaProvider>/<SafeAreaView>
// have deterministic inset metrics under test instead of relying on the
// native module (which isn't present in the Jest environment). The mock
// source is TS with an ES `export default`; after babel's CJS interop the
// required module is `{ default: {...} }`, so unwrap `.default` to get the
// flat, named-export shape our `import { SafeAreaProvider }` expects.
jest.mock('react-native-safe-area-context', () => {
  const mock = require('react-native-safe-area-context/jest/mock');
  return mock.default ?? mock;
});

// GlobalSafeWrapper must only ever be a *consumer* of the single
// <SafeAreaProvider> mounted in App.tsx (via <SafeAreaView>), never a second
// provider. Two mounted providers/duplicate native modules are what caused
// the "Tried to register two views with the same name RNCSafeAreaProvider"
// crash (see apps/customer-app package.json alignment on
// react-native-safe-area-context ^5.8.0 for the underlying dependency fix).
describe('GlobalSafeWrapper', () => {
  it('renders its children when wrapped in the app safe area provider', () => {
    render(
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GlobalSafeWrapper>
          <Text>Screen content</Text>
        </GlobalSafeWrapper>
      </SafeAreaProvider>,
    );

    expect(screen.getByText('Screen content')).toBeTruthy();
  });

  it('does not import or render its own SafeAreaProvider (only one may exist in the app)', () => {
    const source: string = require('fs').readFileSync(
      __filename.replace('.test.tsx', '.tsx'),
      'utf8',
    );
    const codeOnly = source.replace(/\/\*[\s\S]*?\*\//g, '');
    expect(codeOnly).not.toMatch(/SafeAreaProvider/);
  });
});
