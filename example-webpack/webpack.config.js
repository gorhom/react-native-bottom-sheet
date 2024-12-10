const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function () {
  /**
   * @type {webpack.Configuration}
   */
  const config = {
    devtool: 'source-map',
    entry: './index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      static: [{ directory: path.join(__dirname, 'dist') }],
      port: 3000,
    },
    module: { rules: [] },
  };

  config.plugins = [
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== 'production',
      'process.env': 'Object',
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /@shopify\/flash-list/,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ];

  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader'],
  });

  config.module.rules.push({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false,
    },
  });

  config.resolve = {
    extensions: [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.mjs',
      '.tsx',
      '.ts',
      '.jsx',
      '.json',
      '.wasm',
    ],
    alias: {
      'react-native$': 'react-native-web',
    },
  };

  return config;
};
