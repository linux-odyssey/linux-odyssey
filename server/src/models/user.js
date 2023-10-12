import { model } from 'mongoose'

const User = model('User', {
  username: {
    type: String,
    unique: true,
    required: false, // should be required,
    // but need to let social login users to pick one after login
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
