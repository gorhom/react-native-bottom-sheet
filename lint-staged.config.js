module.exports = {
  '**/*.js': ['eslint'],
  '**/*.{ts,tsx}': [() => 'tsc --skipLibCheck --noEmit', 'eslint --fix'],
};
