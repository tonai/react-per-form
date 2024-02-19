/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 80,
      statements: 80,
    },
  },
  roots: ['src'],
  // setupFilesAfterEnv: ['./setupTests.ts'],
  testEnvironment: 'jsdom',
};

export default config;
