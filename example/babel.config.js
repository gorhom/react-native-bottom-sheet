const path = require('path');
const pak = require('../package.json');

const reanimatedPackage = require.resolve('react-native-reanimated/package.json');
const reanimatedVersion = require(reanimatedPackage).version;
const reanimatedMajor = parseInt(reanimatedVersion.split('.')[0], 10);

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            [pak.name]: path.join(__dirname, '..', pak.source),
          },
        },
      ],
      '@babel/plugin-proposal-export-namespace-from',
      reanimatedMajor === 4 ? 'react-native-worklets/plugin': 'react-native-reanimated/plugin',
    ],
  };
};
