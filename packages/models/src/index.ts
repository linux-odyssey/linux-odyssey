import mongoose from 'mongoose'

export { default as User } from './user.js'
export { default as Quest } from './quest.js'
export { default as Session } from './session.js'
export { default as Command } from './command.js'
export { default as UserProfile } from './userProfile.js'

export default async function connectDB(uri: string) {
  const db = await mongoose.connect(uri)
  return db.connection.getClient()
}
