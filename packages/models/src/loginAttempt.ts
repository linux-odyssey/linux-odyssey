import { model, Schema, Document } from 'mongoose'

export interface ILoginAttempt {
  username: string
  ip: string
  userAgent: string
  time: Date
  success: boolean
  message: string
}

export type LoginAttemptDocument = ILoginAttempt & Document

const LoginAttemptSchema = new Schema<LoginAttemptDocument>(
  {
    username: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    time: { type: Date, default: Date.now, required: true },
    success: { type: Boolean, required: true },
    message: {type: String}
  },
  { timestamps: true }
)

export const LoginAttempt = model<LoginAttemptDocument>(
  'LoginAttempt',
  LoginAttemptSchema
)
