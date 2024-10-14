import { generateKeyPair } from '../../src/utils/crypto'

describe('generateKeyPair', () => {
  it('should generate a key pair', () => {
    const keyPair = generateKeyPair()
    expect(keyPair).toHaveProperty('privateKey')
    expect(keyPair).toHaveProperty('publicKey')
  })
})
