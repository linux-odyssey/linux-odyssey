import connectDB from '@linux-odyssey/models'
import { removeExpired } from '../containers/expiryChecker.js'
import config from '../config.js'
import logger from '../utils/logger.js'

connectDB(config.db)
  .then(removeExpired)
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    logger.error(err)
    process.exit(1)
  })
