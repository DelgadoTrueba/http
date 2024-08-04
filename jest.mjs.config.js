/* eslint-disable */
module.exports = {
  displayName: 'http',
  preset: './jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.mjs.spec.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage/mjs',
  setupFiles: ['<rootDir>/src/utils-test/api-mocks/fetch.ts'],
};
