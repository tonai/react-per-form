/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: true,
  roots: ['src'],
  // setupFilesAfterEnv: ['./setupTests.ts'],
  testEnvironment: 'jsdom',
};

export default config;
