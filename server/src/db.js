import mongoose from 'mongoose'
import config from './config.js'

export default async function connectDB() {
  try {
    const db = await mongoose.connect(config.db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB')
    return db.connection.getClient()
  } catch (err) {
    console.error(err)
    process.exit(1)
    return null
  }
}
