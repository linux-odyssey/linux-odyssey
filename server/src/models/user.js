import { model } from 'mongoose'

const User = model('User', {
  username: String,
  password: String,
  email: String,
})

export default User
