import validator from 'validator'
import dotenv from 'dotenv'
import { get } from './utils/env.js'

// Import dotenv and load ../.env
dotenv.config({ path: '../.env' })

function getTrustProxies(key: string): string[] {
  const value = process.env[key]
  if (!value) {
    return []
  }
  return value
    .split(',')
    .map((p) => validator.trim(p))
    .filter((p) => validator.isIPRange(p) || validator.isIP(p))
}

function getUrl(key: string): string {
  const url = get(key, '')
  if (validator.isURL(url)) {
    return validator.trim(url)
  }
  return ''
}

function createConfig() {
  const isProduction = process.env.NODE_ENV === 'production'
  const host = get('HOST', 'localhost')
  const port = Number(get('PORT', 3000))
  const baseUrl = get('BASE_URL', `http://${host}:${port}`)
  const url = new URL(baseUrl)
  return {
    host,
    port,
    baseUrl,
    domain: url.hostname,
    protocol: url.protocol,
    backendUrl: get('BACKEND_URL', baseUrl),
    db: get('MONGO_URL', 'mongodb://localhost:27017/odyssey-test'),
    secret: get('SECRET_KEY', ''),
    isProduction: process.env.NODE_ENV === 'production',
    containerExpiry: get('EXPIRY', 1000 * 60 * 60),
    sessionMaxAge: get('SESSION_MAX_AGE', 1000 * 60 * 60 * 24 * 7),
    google: {
      clientID: get('GOOGLE_CLIENT_ID', ''),
      clientSecret: get('GOOGLE_CLIENT_SECRET', ''),
    },
    github: {
      clientID: get('GITHUB_CLIENT_ID', ''),
      clientSecret: get('GITHUB_CLIENT_SECRET', ''),
    },
    trustedProxies: getTrustProxies('TRUSTED_PROXIES'),
    surveyUrl: getUrl('SURVEY_URL'),
    bugReportUrl: getUrl('BUG_REPORT_URL'),

    docker: {
      network: get('DOCKER_NETWORK', 'host'),
      defaultImage: get('QUEST_IMAGE', 'linuxodyssey/quest-base'),
      imagePrefix: get('DOCKER_PREFIX', 'linuxodyssey/quest-'),
      mountQuest: get('MOUNT_QUEST', ''),
      hostPwd: get('HOST_PWD', ''),
    },

    log: {
      path: get('LOG_PATH', '../logs'),
    },
    testing: {
      enabled: !isProduction && process.env.TESTING === 'true',
      username: get('TESTING_USERNAME', ''),
      password: get('TESTING_PASSWORD', ''),
    },
  }
}

const config = createConfig()

export function getQuestImage(id: string): string {
  return `${config.docker.imagePrefix}${id}`
}

export default config
