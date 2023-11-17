import { User } from '@linux-odyssey/models'
import config from '../config.js'
import { createUser } from '../models/userManager.js'

export default async function setupTest() {
  console.log('Setting up test account')
  if (!(config.testing.username && config.testing.password)) {
    throw new Error(
      'No testing account found! Please set TESTING_USERNAME and TESTING_PASSWORD in .env'
    )
  }
  const { username, password } = config.testing
  const email = `${username}@example.com`

  if (await User.exists({ username })) {
    console.log('Testing account already exists')
    return
  }

  await createUser(username, email, password)
  console.log('Created testing account')
}
