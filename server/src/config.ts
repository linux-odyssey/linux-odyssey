import validator from 'validator'
import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import { get } from './utils/env.js'
import { loadOrCreateKeyPair } from './utils/crypto.js'

// Import dotenv and load ../.env
dotenvConfig({ path: '../.env' })
if (process.env.NODE_ENV !== 'production') {
  dotenvConfig({ path: '../.env.dev' })
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
  const backendUrl = get('BACKEND_URL', `http://host.docker.internal:${port}`)
  const url = new URL(baseUrl)
  const projectRoot = getProjectRoot()
  const keypairPath = get(
    'KEYPAIR_PATH',
    path.join(projectRoot, 'config', 'ssh_key')
  )
  const keypair = loadOrCreateKeyPair(keypairPath)

  return {
    host,
    port,
    baseUrl,
    domain: url.hostname,
    protocol: url.protocol,
    backendUrl,
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

    projectRoot,

    docker: {
      network: get('DOCKER_NETWORK', 'linux-odyssey-players-dev'),
      defaultImage: get('QUEST_IMAGE', 'linuxodyssey/quest-base'),
      imagePrefix: get('DOCKER_PREFIX', 'linuxodyssey/quest-'),
      mountQuest: process.env.MOUNT_QUEST === 'true',
      hostProjectRoot: get('HOST_PROJECT_ROOT', projectRoot),
      keypairPath,
      keypair,
    },

    log: {
      path: get('LOG_PATH', path.join(projectRoot, 'logs')),
    },
    testing: {
      enabled: !isProduction && process.env.TESTING === 'true',
      username: get('TESTING_USERNAME', ''),
      password: get('TESTING_PASSWORD', ''),
    },
  }
}

function getProjectRoot(): string {
  const root = path.join(path.dirname(__filename), '..', '..')
  return root
}

const config = createConfig()

export function getQuestImage(id: string): string {
  // TODO: handle staging images (add version tag)
  return `${config.docker.imagePrefix}${id}`
}

export default config
