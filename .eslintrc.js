// ESLint for the Expo/React Native app. `expo` brings the React/React Native
// rules; `prettier` turns off formatting rules so Prettier owns formatting.
module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  ignorePatterns: [
    'node_modules/',
    'backend/',
    'design/',
    'dist/',
    'web-build/',
    '.expo/',
  ],
  overrides: [
    {
      files: ['**/__tests__/**/*', '*.test.js'],
      env: { jest: true },
    },
  ],
};
