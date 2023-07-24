/* eslint-disable import/prefer-default-export */
import User from '../models/user.js'

export async function defaultUser() {
  let user = await User.findOne({ username: 'defaultUser' })
  if (!user) {
    user = new User({
      username: 'defaultUser',
      email: 'jackson@example.com',
    })
    await user.save()
  }
  return user
}
