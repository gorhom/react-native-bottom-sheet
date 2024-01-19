const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

const root = path.resolve(__dirname, '..');
const node_modules = path.join(__dirname, 'node_modules');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ['react-native-reanimated'],
      },
    },
    argv
  );

  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    include: path.resolve(root, 'src'),
    use: 'babel-loader',
  });

  Object.assign(config.resolve.alias, {
    react: path.join(node_modules, 'react'),
    'react-native': path.join(node_modules, 'react-native'),
    'react-native-web': path.join(node_modules, 'react-native-web'),
    'react-native-reanimated': path.join(
      node_modules,
      'react-native-reanimated'
    ),
    'react-native-gesture-handler': path.join(
      node_modules,
      'react-native-gesture-handler'
    ),
  });

  // Customize the config before returning it.
  return config;
};
