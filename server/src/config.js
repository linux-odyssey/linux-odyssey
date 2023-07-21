function get(key, defaultValue) {
  const value = process.env[key]
  if (value != null) {
    return value
  }
  return defaultValue
}

export default {
  host: get('HOST', 'localhost'),
  port: get('PORT', 3000),
  db: get('MONGO_URL', 'mongodb://localhost:27017/odyssey-test'),
}
