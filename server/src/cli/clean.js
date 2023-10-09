import connectDB from '@linux-odyssey/models'
import { removeExpired } from '../containers/expiryChecker.js'
import config from '../config.js'

connectDB(config.db)
  .then(removeExpired)
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
