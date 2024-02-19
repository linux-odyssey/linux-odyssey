import mongoose from 'mongoose'

export { User, IUser } from './user.js'
export { Quest, IQuest } from './quest.js'
export { Session, ISession } from './session.js'
export { Command, ICommand } from './command.js'
export { UserProfile, IUserProfile } from './userProfile.js'
export { IFileCondition, ICondition } from './condition.js'

export default async function connectDB(uri: string) {
  const db = await mongoose.connect(uri)
  return db.connection.getClient()
}
