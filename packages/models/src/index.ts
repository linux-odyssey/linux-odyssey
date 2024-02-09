import mongoose from 'mongoose'

export { User } from './user.js'
export { Quest, IQuest } from './quest.js'
export { Session } from './session.js'
export { Command, ICommand } from './command.js'
export { UserProfile } from './userProfile.js'

export default async function connectDB(uri: string) {
  const db = await mongoose.connect(uri)
  return db.connection.getClient()
}
