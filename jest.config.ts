export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Use a dedicated tsconfig to avoid global type conflicts with Vitest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
  roots: ['<rootDir>/src/lib/__tests__'],
  testMatch: ['**/__tests__/greeting.test.ts'],
  collectCoverageFrom: ['<rootDir>/src/lib/greeting.ts'],
  coverageDirectory: '<rootDir>/.coverage',
  coverageReporters: ['text', 'lcov'],
} satisfies import('jest').Config;