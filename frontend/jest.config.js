module.exports = {
  testMatch: [
    '**/tests_/**/*.test.js',
    '**/__tests__/**/*.test.js',
    '**/*.(test|spec).js'
  ],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|scss)$': 'identity-obj-proxy'
  }
};