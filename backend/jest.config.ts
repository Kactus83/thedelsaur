export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.ts'],
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.module.ts',
      '!src/**/index.ts',
    ],
    coverageDirectory: 'coverage',
  };
  