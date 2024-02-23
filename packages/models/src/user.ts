import { model, Schema } from 'mongoose'

export interface ISocialLogin {
  provider: string
  id: string
  displayName?: string
}

const socialLoginSchema = new Schema<ISocialLogin>({
  provider: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: false,
  },
})

export interface IUser {
  username: string
  email: string
  hashedPassword: string
  socialLogins: Map<string, ISocialLogin>
  createdAt: Date
  updatedAt: Date
}

export const User = model<IUser>(
  'User',
  new Schema<IUser>(
    {
      username: {
        type: String,
        unique: true,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
      },
      hashedPassword: String,
      socialLogins: {
        type: Map,
        of: socialLoginSchema,
        default: {},
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
)
