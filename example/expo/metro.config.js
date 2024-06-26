const path = require('path');
const fs = require('fs');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '../..');
const rootPak = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8')
);

const app = path.join(__dirname, '../app');
const appPak = JSON.parse(
  fs.readFileSync(path.join(app, 'package.json'), 'utf8')
);

const modules = [
  '@babel/runtime',
  ...Object.keys({
    ...rootPak.dependencies,
    ...rootPak.peerDependencies,
    ...appPak.devDependencies,
    ...appPak.peerDependencies,
  }),
];

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;
config.watchFolders = [root];

config.resolver = {
  ...config.resolver,
  blacklistRE: exclusionList([
    new RegExp(`^${escape(path.join(root, 'node_modules'))}\\/.*$`),
    new RegExp(`^${escape(path.join(app, 'node_modules'))}\\/.*$`),
  ]),
  extraNodeModules: modules.reduce((acc, name) => {
    acc[name] = path.join(__dirname, 'node_modules', name);
    return acc;
  }, {}),
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
