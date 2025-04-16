import mongoose from 'mongoose'

export { User, IUser } from './user.js'
export { Quest, IQuest } from './quest.js'
export { Session, ISession, ITask } from './session.js'
export { Command, ICommand } from './command.js'
export { UserProfile, IUserProfile, IProgress } from './userProfile.js'
export { IFileCondition, ICondition } from './condition.js'
export { IStage } from './stage.js'
export { IRequirement } from './requirement.js'
export { IResponse } from './response.js'
export { IException } from './exception.js'

export default async function connectDB(uri: string) {
  const db = await mongoose.connect(uri)
  return db.connection.getClient()
}

console.log('Loaded models package')
