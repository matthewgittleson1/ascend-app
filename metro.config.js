// Metro configuration for Expo + React Native
// Goal: avoid Metro hangs caused by Watchman instability and huge native folders (Pods/build outputs).
const { getDefaultConfig } = require('expo/metro-config');
// NOTE: metro-config doesn't export exclusionList from its main entrypoint.
// This internal helper is the supported way Metro docs have historically referenced it.
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

// Watchman has previously shown timeouts / reconnect loops in this repo.
// Disabling it forces Metro to use Node-based crawling/watching, which is often more stable for local prototyping.
config.resolver = {
  ...(config.resolver || {}),
  useWatchman: false,
};

// Exclude large native build trees that can explode file crawling and trigger deadlocks/timeouts.
// Note: Metro expects regexes matching absolute paths too, so we include "/ios/Pods/" etc.
config.resolver = {
  ...(config.resolver || {}),
  // keep useWatchman=false even if expo defaults change
  useWatchman: false,
  blockList: exclusionList([
    /\/ios\/Pods\/.*/,
    /\/ios\/build\/.*/,
    /\/ios\/DerivedData\/.*/,
    /\/android\/build\/.*/,
    /\/android\/app\/build\/.*/,
    /\/android\/\.gradle\/.*/,
  ]),
};

module.exports = config;


