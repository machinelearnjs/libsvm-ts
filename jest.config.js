module.exports = {
  preset: 'ts-jest',
  bail: true,
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: false,
  testMatch: ['**/test/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/build/'],
  collectCoverageFrom: ['<rootDir>/src/**', '!<rootDir>/src/api/index.ts', '!<rootDir>/src/utils/Config.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/__tests__'],
  coverageThreshold: {
    global: {
      statements: 50,
    },
  }
};
