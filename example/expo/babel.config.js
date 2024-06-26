const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '../..');
const rootPak = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
);

const app = path.join(__dirname, '../app');
const appPak = JSON.parse(
  fs.readFileSync(path.join(app, 'package.json'), 'utf8')
);

/** @type {import('@babel/core').TransformOptions['plugins']} */
const plugins = [
  /** react-native-reanimated web support @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#web */
  '@babel/plugin-proposal-export-namespace-from',
  [
    'module-resolver',
    {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
        // For development, we want to alias the library to the source
        [rootPak.name]: path.join(root, rootPak['react-native']),
        [appPak.name]: path.join(app, appPak['react-native']),
      },
    },
  ],
  /** NOTE: This must be last in the plugins @see https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin */
  'react-native-reanimated/plugin',
];

/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      production: {},
    },
    plugins,
  };
};
