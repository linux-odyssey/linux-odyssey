import { User, UserProfile } from '@linux-odyssey/models'
import { hashPassword } from '../utils/auth.js'

export async function createUser(username, email, { password, socialLogin }) {
  const user = new User({
    username,
    email,
  })
  if (password) {
    user.hashedPassword = await hashPassword(password)
  } else if (socialLogin) {
    user.socialLogins.set(socialLogin.provider, socialLogin)
  } else {
    throw new Error('No password or social login provided')
  }
  await user.save()

  const userProfile = new UserProfile({
    user,
  })
  await userProfile.save()

  return user
}
