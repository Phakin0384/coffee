// Jest for the frontend's pure logic. babel-jest uses the project babel.config
// (babel-preset-expo), which also transforms TypeScript.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
