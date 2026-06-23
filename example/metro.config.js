const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * `react-native-monorepo-config` is an ES module, so it must be loaded with a
 * dynamic `import()`. Metro supports a config that resolves to a Promise.
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = (async () => {
  const { withMetroConfig } = await import('react-native-monorepo-config');

  return withMetroConfig(getDefaultConfig(__dirname), {
    root,
    dirname: __dirname,
    conditions: ['react-native-modern-photo-picker-source'],
  });
})();
