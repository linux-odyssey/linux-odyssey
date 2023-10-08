import mongoose from 'mongoose'

export { default as User } from './user.js'
export { default as Quest } from './quest.js'
export { default as Session } from './session.js'
export { default as Command } from './command.js'

export default async function connectDB(uri) {
  try {
    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB')
    console.log(mongoose.models)
    return db.connection.getClient()
  } catch (err) {
    console.error(err)
    process.exit(1)
    return null
  }
}
