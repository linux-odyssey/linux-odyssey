import { User } from '../../../packages/models'
import config from '../config.js'
import { createUser } from '../models/userManager.js'
import logger from './logger.js'

export default async function setupTest() {
  logger.info('Setting up test account')
  if (!(config.testing.username && config.testing.password)) {
    throw new Error(
      'No testing account found! Please set TESTING_USERNAME and TESTING_PASSWORD in .env'
    )
  }
  const { username, password } = config.testing
  const email = `${username}@example.com`

  if (await User.exists({ username })) {
    logger.info('Testing account already exists')
    return
  }

  await createUser(username, email, { password })
  logger.info('Created testing account')
}
