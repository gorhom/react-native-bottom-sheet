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

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'react-native-reanimated/plugin',
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
    ],
  };
};
