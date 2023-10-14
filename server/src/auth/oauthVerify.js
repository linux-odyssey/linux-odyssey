import { User } from '@linux-odyssey/models'

export default async function oauthVerify(provider, profile, query, cb) {
  process.nextTick(async () => {
    const email = profile.emails[0]?.value
    if (!email) {
      return cb(new Error('No email found'))
    }

    let user = await User.findOne(query)
    if (!user) {
      user = await User.findOne({ email })
      if (!user) {
        const newUser = { email }
        newUser[provider] = profile
        return cb(null, { newUser })
      }
      user[provider] = profile
      await user.save()
    }

    return cb(null, user)
  })
}
