import mongoose from 'mongoose'

export { User, type IUser } from './user.js'
export { Session, type ISession } from './session.js'
export { Command, type ICommand } from './command.js'
export {
  UserProfile,
  type IUserProfile,
  type IProgress,
} from './userProfile.js'
export { type ILoginAttempt, LoginAttempt } from './loginAttempt.js'

export async function connectDB(uri: string) {
  const db = await mongoose.connect(uri)
  return db.connection.getClient()
}

console.log('Loaded models package')
