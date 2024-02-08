/** @type {import('jest').Config} */
const config = {
  roots: ['src'],
  // setupFilesAfterEnv: ['./setupTests.ts'],
  testEnvironment: 'jsdom',
};

export default config;
