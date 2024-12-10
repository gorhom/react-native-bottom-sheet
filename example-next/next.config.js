const webpack = require('webpack');

/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: config => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
        'process.env': 'Object',
      })
    );
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
};
