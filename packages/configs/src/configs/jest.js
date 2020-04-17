// @flow

export default {
  filenames: {
    config: 'jest.config.js',
  },
  config: () => ({
    setupFiles: ['@mikojs/jest'],
    testPathIgnorePatterns: ['__tests__/__ignore__'],
    collectCoverage: true,
    collectCoverageFrom: [
      '**/src/**/*.js',
      '**/src/**/.*/**/*.js',
      '!**/bin/*.js',
    ],
    coveragePathIgnorePatterns: ['__tests__/__ignore__'],
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text'],
    coverageThreshold: {
      global: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: -10,
      },
    },
  }),
};
