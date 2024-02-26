const { defineConfig } = require('cypress')
const process = require('process')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config({ path: '../.env.dev' })
dotenv.config({ path: '../.env' })

const getConfig = (key, defaultValue) => {
  return process.env[key] || defaultValue
}
const getOrFail = (key) => {
  const value = getConfig(key, null)
  if (value === null) {
    throw new Error(`Missing required environment variable ${key}`)
  }
  return value
}

const EnableoAuth = fs.existsSync('../.env')

module.exports = defineConfig({
  e2e: {
    baseUrl: getConfig('BASE_URL', 'http://localhost:5173'),
    viewportWidth: 1920,
    viewportHeight: 1080,
    pageLoadTimeout: 120000,
    redirectionLimit: 20,
    defaultCommandTimeout: 10000,
    retries: { runMode: 5, openMode: 5 },
  },
  env: {
    defaultAccount: getOrFail('TESTING_USERNAME'),
    defaultPassword: getOrFail('TESTING_PASSWORD'),
    isCHVersion: true,
    EnableoAuth,
  },
})
