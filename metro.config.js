// Learn more: https://docs.expo.dev/guides/monorepos/#metro-config
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro can resolve package exports like `firebase/auth`
config.resolver = config.resolver || {};
config.resolver.unstable_enablePackageExports = true;

// Some packages ship commonjs files; include cjs just in case
if (config.resolver.sourceExts && !config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

module.exports = config;


