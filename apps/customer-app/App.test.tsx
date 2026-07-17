// Regression guard for: MainTabs was registered as
// `component={() => (<Tab.Navigator>...</Tab.Navigator>)}` — an inline
// arrow function. React Navigation treats the `component` prop's identity
// as the screen's component *type*; a fresh arrow function is a new type on
// every render of <App />, which unmounts/remounts the whole tab navigator
// and resets tab navigation state (selected tab, per-tab history) on every
// re-render of the root component.
//
// Note: MainTabsNavigator is now defined in RootNavigator.tsx for proper
// navigation structure with token-based authentication.
describe('MainTabs registration (RootNavigator)', () => {
  const rootNavigatorSource = require('fs').readFileSync(
    require('path').join(__dirname, 'src/navigation/RootNavigator.tsx'),
    'utf8',
  );
  
  const codeOnly = rootNavigatorSource.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

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
