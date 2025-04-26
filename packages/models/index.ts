import mongoose from 'mongoose'

export { User, IUser } from './user.js'
export { Session, ISession } from './session.js'
export { Command, ICommand } from './command.js'
export { UserProfile, IUserProfile, IProgress } from './userProfile.js'

export async function connectDB(uri: string) {
  const db = await mongoose.connect(uri)
  return db.connection.getClient()
}

console.log('Loaded models package')
