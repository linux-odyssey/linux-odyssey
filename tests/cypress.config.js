const { defineConfig } = require('cypress')
const process = require('process')
require('dotenv').config()

const getConfig = (key, defaultValue) => {
  return process.env[key] || defaultValue
}

module.exports = defineConfig({
  e2e: {
    baseUrl: getConfig('BASE_URL', 'http://localhost:5173'),
    viewportWidth: 1920,
    viewportHeight: 1080,
    pageLoadTimeout: 120000,
  },
  env: {
    ...process.env,
    defaultAccount: process.env.default_USERNAME,
    defaultPassword: process.env.default_PASSWORD,
    // google_username: process.env.GOOGLE_USERNAME,
    // google_password: process.env.GOOGLE_PASSWORD,
    // google_client_id: process.env.GOOGLE_CLIENT_ID,
    // google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    // github_username: process.env.GITHUB_USERNAME,
    // github_password: process.env.GITHUB_PASSWORD,
    // github_client_id: process.env.GITHUB_CLIENT_ID,
    // github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  },
})
