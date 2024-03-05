import { Types } from 'mongoose'

export interface User {
  username: string
}
export interface SessionDocument {
  _id: Types.ObjectId
  user: User
  quest: string
  status: string
  createdAt: Date
  finishedAt: Date
}
export interface CommandObject {
  command: string
  pwd: string
  stage: string | null | undefined
  output: string | undefined
  error: string | undefined
  createdAt: string
}
export interface SessionObject {
  _id: Types.ObjectId
  user: string
  quest: string
  status: string
  createdAt: string
  finishedAt: string
  lastActivityAt: string
  usedTime: string
  commandCount: number
  commands: CommandObject[]
}
export interface SessionDetail {
  _id: Types.ObjectId
  user: string
  quest: string
  status: string
  createdAt: string
  finishedAt: string
  usedTime: string
  commands: CommandObject[]
}
export interface IUser extends Document {
  hashedPassword?: string
  socialLogins?: Record<
    string,
    {
      id: string
      provider: string
      displayName?: string | null | undefined
    }
  >
}
export interface UserSessionDetail {
  _id: Types.ObjectId
  quest: string
  status: string
  createdAt: string
  usedTime: string
}
