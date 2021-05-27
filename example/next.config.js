const { withExpo } = require('@expo/next-adapter');
const withPlugins = require('next-compose-plugins');

const withTM = require('next-transpile-modules')(['@gorhom/bottom-sheet']);

const nextConfig = {
  future: { webpack5: false },
};

module.exports = withPlugins(
  [withTM, [withExpo, { projectRoot: __dirname }]],
  nextConfig
);
