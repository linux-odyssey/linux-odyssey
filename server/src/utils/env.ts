import crypto from 'crypto'

export function get<T>(key: string, defaultValue: T): T {
  const value = process.env[key]
  return value !== undefined ? (value as unknown as T) : defaultValue
}

export function genSecret() {
  return crypto.randomUUID()
}
