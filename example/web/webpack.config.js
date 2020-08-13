const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname, '../');

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.(jsx?|tsx?)$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.tsx'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, '../src'),
    path.resolve(appDirectory, '../node_modules/react-native-maps'),
    path.resolve(appDirectory, '../node_modules/react-native-gesture-handler'),
    path.resolve(appDirectory, 'node_modules/react-native-maps'),
    path.resolve(appDirectory, 'node_modules/react-native-gesture-handler'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        'module:metro-react-native-babel-preset',
        '@babel/preset-typescript',
      ],
      plugins: [
        'react-native-web',
        [
          'module-resolver',
          {
            root: ['./'],
            alias: {
              '^react-native$': path.resolve(
                appDirectory,
                'node_modules/react-native-web'
              ),
              '@gorhom/bottom-sheet': '../src/index',
            },
          },
        ],
      ],
    },
  },
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};

module.exports = {
  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, 'index.tsx'),
  ],

  // configures where the build ends up
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
  },

  module: {
    rules: [imageLoaderConfiguration, babelLoaderConfiguration],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.join(__dirname, './index.html') }),
    new webpack.DefinePlugin({ __DEV__: true }),
    new webpack.IgnorePlugin(/@react-native-community\/blur$/),
  ],
  resolve: {
    // This will only alias the exact import "react-native"
    alias: {
      'react-native$': path.resolve(
        appDirectory,
        'node_modules/react-native-web'
      ),
      '@gorhom/bottom-sheet': '../src/index',
      react: path.resolve(appDirectory, '../node_modules/react'),
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.web.jsx',
      '.web.js',
      '.jsx',
      '.js',
    ],
  },
};
