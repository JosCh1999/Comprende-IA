
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageReporters: ["text", "text-summary"],
  testTimeout: 30000,
  setupFiles: ['./jest.setup.js'],
};