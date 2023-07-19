import mongoose from 'mongoose'

export default async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/odyssey-test')
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
  }
}
