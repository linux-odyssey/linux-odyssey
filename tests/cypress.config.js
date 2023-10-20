const { defineConfig } = require('cypress')
const process = require('process')

const getConfig = (key, defaultValue) => {
  return process.env[key] || defaultValue
}

module.exports = defineConfig({
  e2e: {
    baseUrl: getConfig('BASE_URL', 'http://localhost:5173'),
    viewportWidth: 1920,
    viewportHeight: 1080,
  },
})
