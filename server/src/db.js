import mongoose from 'mongoose'
import config from './config.js'

export default async function connectDB() {
  try {
    await mongoose.connect(config.db)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
  }
}
