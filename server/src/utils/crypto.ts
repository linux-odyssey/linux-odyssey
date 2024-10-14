import fs from 'fs'
import ssh2 from 'ssh2'

const {
  utils: { generateKeyPairSync },
} = ssh2

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
  const { private: privateKey, public: publicKey } =
    generateKeyPairSync('ed25519')
  return { privateKey, publicKey }
}
