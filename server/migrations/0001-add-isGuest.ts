import { connectDB, User } from '../../packages/models'

async function migrate() {
  await connectDB(
    process.env.MONGO_URL || 'mongodb://localhost:27017/odyssey-test'
  )
  await User.updateMany(
    {
      isGuest: { $exists: false },
    },
    { $set: { isGuest: false } }
  )
}

migrate()
  .then(() => {
    console.log('Migration completed')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
