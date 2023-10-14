import { model, Schema } from 'mongoose'

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
      google: {
        id: String,
        displayName: String,
      },
      github: {
        id: String,
        displayName: String,
      },
    },
    {
      timestamps: true,
    }
  )
)

export default User
