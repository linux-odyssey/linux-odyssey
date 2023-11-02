import crypto from 'crypto'

export function get(key, defaultValue) {
  const value = process.env[key]
  if (value != null) {
    return value
  }
  return defaultValue
}

export function genSecret() {
  return crypto.randomUUID()
}
