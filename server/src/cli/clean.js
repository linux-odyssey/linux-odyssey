import { removeExpired } from '../containers/expiryChecker.js'
import connectDB from '../db.js'

connectDB()
  .then(removeExpired)
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
