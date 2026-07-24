// ESLint for the Expo/React Native app. `expo` brings the React/React Native
// rules; `prettier` turns off formatting rules so Prettier owns formatting.
module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  // React Native supplies the browser-style timer and animation globals, but
  // there is no built-in ESLint env that declares them.
  globals: {
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
    requestAnimationFrame: 'readonly',
    cancelAnimationFrame: 'readonly',
    fetch: 'readonly',
  },
  ignorePatterns: ['node_modules/', 'backend/', 'design/', 'dist/', 'web-build/', '.expo/'],
  overrides: [
    {
      files: ['**/__tests__/**/*', '*.test.js'],
      env: { jest: true },
    },
  ],
};
