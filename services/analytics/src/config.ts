import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.dev' })
}

function getOrFailed(key: string): string {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return process.env[key] as string
}

interface Config {
  host: string
  port: number
  db: string
  username: string
  password: string
  baseUrl: string
}

const config: Config = {
  host: process.env.ADMIN_HOST || 'localhost',
  port: process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT, 10) : 3001,
  db: process.env.MONGO_URL || 'mongodb://localhost:27017/odyssey-test',
  username: getOrFailed('ADMIN_USERNAME'),
  password: getOrFailed('ADMIN_PASSWORD'),
  baseUrl:
    process.env.ADMIN_BASE_URL ||
    `http://${process.env.ADMIN_HOST || 'localhost'}:${
      process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT, 10) : 3001
    }`,
}

export default config
