// Regression guard for: MainTabs was registered as
// `component={() => (<Tab.Navigator>...</Tab.Navigator>)}` — an inline
// arrow function. React Navigation treats the `component` prop's identity
// as the screen's component *type*; a fresh arrow function is a new type on
// every render of <App />, which unmounts/remounts the whole tab navigator
// and resets tab navigation state (selected tab, per-tab history) on every
// re-render of the root component.
//
// App.tsx (and its screen dependencies, e.g. AsyncStorage-backed stores and
// the lucide-react-native ESM package) pull in enough native/module surface
// that a full `render(<App />)` here would require expanding this project's
// Jest transform/mock configuration well beyond this fix's scope. A static
// source check is the precedent already used in this codebase for the same
// class of regression (see GlobalSafeWrapper.test.tsx's "does not import or
// render its own SafeAreaProvider" check) and is sufficient to lock in the
// invariant without that infra expansion.
describe('App (MainTabs registration)', () => {
  const source: string = require('fs').readFileSync(
    __filename.replace('.test.tsx', '.tsx'),
    'utf8',
  );
  const codeOnly = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

  it('does not register MainTabs with an inline function as the `component` prop', () => {
    // Matches `component={() => ...}` / `component={function () {...}}`
    // immediately following the MainTabs screen registration.
    const mainTabsScreenMatch = codeOnly.match(
      /<Stack\.Screen[\s\S]*?name="MainTabs"[\s\S]*?\/>/,
    );
    expect(mainTabsScreenMatch).not.toBeNull();
    const mainTabsScreen = mainTabsScreenMatch![0];

    expect(mainTabsScreen).not.toMatch(/component=\{\s*\(\)\s*=>/);
    expect(mainTabsScreen).not.toMatch(/component=\{\s*function/);
  });

  it('registers MainTabs with a stable, named component reference', () => {
    expect(codeOnly).toMatch(/function MainTabsNavigator\s*\(/);
    expect(codeOnly).toMatch(/component=\{MainTabsNavigator\}/);
  });
});
