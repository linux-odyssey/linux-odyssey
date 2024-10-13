import validator from 'validator'
import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { get } from './utils/env.js'

// Import dotenv and load ../.env
dotenv.config({ path: '../.env' })
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '../.env.dev' })
}

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
  const host = get('HOST', '0.0.0.0')
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
    containerExpiry: Number(process.env.CONTAINER_EXPIRY ?? 60) * 1000 * 60,
    sessionMaxAge:
      Number(process.env.SESSION_MAX_AGE ?? 7 * 24) * 1000 * 60 * 60,
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
      mountQuest: process.env.MOUNT_QUEST === 'true',
    },

    projectRoot: getProjectRoot(),

    log: {
      path: get('LOG_PATH', path.join(getProjectRoot(), 'logs')),
    },
    testing: {
      enabled: !isProduction && process.env.TESTING === 'true',
      username: get('TESTING_USERNAME', ''),
      password: get('TESTING_PASSWORD', ''),
    },
  }
}

function getProjectRoot(): string {
  const filename = fileURLToPath(import.meta.url)
  const root = path.join(path.dirname(filename), '..', '..')
  return root
}

const config = createConfig()

export function getQuestImage(id: string): string {
  return `${config.docker.imagePrefix}${id}`
}

export default config
