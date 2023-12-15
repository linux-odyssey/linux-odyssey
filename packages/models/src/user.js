import { model, Schema } from 'mongoose'

const socialLoginSchema = new Schema({
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

const User = model(
  'User',
  new Schema(
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

export default User
