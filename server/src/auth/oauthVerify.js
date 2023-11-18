import { User } from '@linux-odyssey/models'

export default async function oauthVerify(provider, profile, query, cb) {
  process.nextTick(async () => {
    const email = profile.emails[0]?.value
    if (!email) {
      return cb(new Error('No email found'))
    }

    const socialLogin = {
      provider,
      id: profile.id,
      displayName: profile.displayName,
    }
    let user = await User.findOne(query)
    if (!user) {
      user = await User.findOne({ email })
      if (!user) {
        const newUser = { email, socialLogin }
        return cb(null, { newUser })
      }
      user.socialLogins.set(provider, socialLogin)
      await user.save()
    }

    return cb(null, user)
  })
}
