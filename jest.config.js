/** @type {import('ts-jest').JestConfigWithTsJest} */
// const { jsWithTs: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Redirect .js imports to .ts files
  },
}
