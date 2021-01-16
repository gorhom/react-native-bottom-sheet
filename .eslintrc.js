module.exports = {
  root: true,
  extends: ['@react-native-community', 'prettier'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prettier/prettier': [
      'error',
      {
        printWidth: 80,
        arrowParens: 'avoid',
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      },
    ],
  },
};
