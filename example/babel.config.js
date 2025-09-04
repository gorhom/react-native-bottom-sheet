const path = require('node:path');
const pak = require('../package.json');

module.exports = api => {
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
      'react-native-worklets/plugin',
    ],
  };
};
