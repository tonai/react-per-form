/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/contexts/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 80,
      statements: 80,
    },
  },
  reporters: ['default'],
  roots: ['src'],
  setupFilesAfterEnv: ['./setupTests.ts'],
  testEnvironment: 'jsdom',
};

export default config;
