import fs from 'fs'
import { generateKeyPairSync } from 'crypto'

type KeyPair = {
  privateKey: string
  publicKey: string
}

export function loadOrCreateKeyPair(privateKeyPath: string): KeyPair {
  const publicKeyPath = `${privateKeyPath}.pub`
  if (fs.existsSync(privateKeyPath) && fs.existsSync(publicKeyPath)) {
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8')
    return { privateKey, publicKey }
  }
  const keyPair = generateKeyPair()
  fs.writeFileSync(privateKeyPath, keyPair.privateKey, {
    mode: 0o600,
  })
  fs.writeFileSync(publicKeyPath, keyPair.publicKey, {
    mode: 0o600,
  })
  return keyPair
}

export function generateKeyPair(): KeyPair {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  })
  return { privateKey, publicKey }
}
