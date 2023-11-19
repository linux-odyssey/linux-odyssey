function getOrFailed(key) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return process.env[key]
}

const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3001,
  db: process.env.MONGO_URL || 'mongodb://localhost:27017/odyssey-test',
  username: getOrFailed('ADMIN_USERNAME'),
  password: getOrFailed('ADMIN_PASSWORD'),
}

config.baseUrl = process.env.BASE_URL || `http://${config.host}:${config.port}`

export default config
