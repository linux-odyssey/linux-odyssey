import { get } from './utils/env.js'

export default {
  host: get('HOST', 'localhost'),
  port: get('PORT', 3000),
  db: get('MONGO_URL', 'mongodb://localhost:27017/odyssey-test'),
  jwtSecret: get('JWT_SECRET', 'secret'),
  dockerNetwork: get('DOCKER_NETWORK', 'linux-odyssey-players'),
  isProduction: process.env.NODE_ENV === 'production',
  hostPwd: get('HOST_PWD', ''),
  expiry: get('EXPIRY', 1000 * 60 * 60),
}
