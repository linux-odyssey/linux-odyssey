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
  host: process.env.HOST || 'localhost',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  db: process.env.MONGO_URL || 'mongodb://localhost:27017/odyssey-test',
  username: getOrFailed('ADMIN_USERNAME'),
  password: getOrFailed('ADMIN_PASSWORD'),
  baseUrl:
    process.env.BASE_URL ||
    `http://${process.env.HOST || 'localhost'}:${process.env.PORT ? parseInt(process.env.PORT, 10) : 3001}`,
}

export default config
