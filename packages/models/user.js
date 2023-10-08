import { model } from 'mongoose'

const User = model('User', {
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
})

export default User
