import connectDB from '../../../packages/models'
import { removeExpired } from '../containers/expiryChecker'
import config from '../config'
import logger from '../utils/logger'

connectDB(config.db)
  .then(removeExpired)
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    logger.error(err)
    process.exit(1)
  })
