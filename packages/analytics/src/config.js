const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3001,
  db: process.env.MONGO_URL || 'mongodb://localhost:27017/odyssey-test',
}

config.baseUrl = process.env.BASE_URL || `http://${config.host}:${config.port}`

export default config
