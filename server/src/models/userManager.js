import { User, UserProfile } from '@linux-odyssey/models'
import { hashPassword } from '../utils/auth.js'

export async function createUser(username, email, password) {
  const user = new User({
    username,
    email,
  })
  user.hashedPassword = await hashPassword(password)
  await user.save()

  const userProfile = new UserProfile({
    user,
  })
  await userProfile.save()
}
