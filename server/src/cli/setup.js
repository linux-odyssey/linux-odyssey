import { genSecret } from '../utils/env.js'

function setup() {
  console.log('Setting up .env file...')
  const secret = genSecret()
  console.log(`SECRET_KEY=${secret}`)
}

setup()
