import { defineConfig } from 'cypress'
import process from 'process'
import dotenv from 'dotenv'
import fs from 'fs' // Import fs module

dotenv.config({ path: '../.env.dev' })
dotenv.config({ path: '../.env' })

const getConfig = (key, defaultValue) => {
  return process.env[key] || defaultValue
}

const getOrFail = (key) => {
  const value = getConfig(key)
  if (!value) {
    throw new Error(`Missing required environment variable ${key}`)
  }
  return value
}

// Check if the .env file exists
const EnableoAuth = fs.existsSync('../.env')

export default defineConfig({
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
    EnableoAuth, // Add the EnableoAuth variable here
    // google_username: process.env.GOOGLE_USERNAME,
    // google_password: process.env.GOOGLE_PASSWORD,
    // google_client_id: process.env.GOOGLE_CLIENT_ID,

    // github_username: process.env.GITHUB_USERNAME,
    // github_password: process.env.GITHUB_PASSWORD,
    // github_client_id: process.env.GITHUB_CLIENT_ID,
  },
})
