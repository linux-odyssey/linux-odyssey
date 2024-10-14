import { generateKeyPairSync } from 'crypto'

type KeyPair = {
  privateKey: string
  publicKey: string
}

export function generateKeyPair(): KeyPair {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519', {
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
