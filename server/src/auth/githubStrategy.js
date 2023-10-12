import GitHubStrategy from 'passport-github2'

import config from '../config.js'
import User from '../models/user.js'

function verify(accessToken, refreshToken, profile, cb) {
  process.nextTick(async () => {
    const email = profile.emails[0]?.value
    if (!email) {
      cb(new Error('No email found'))
      return
    }

    let user = await User.findOne({ 'github.id': profile.id })
    if (!user) {
      user = await User.findOne({ email })
      const github = {
        id: profile.id,
        displayName: profile.displayName,
      }
      if (!user) {
        const newUser = {
          email,
          github,
        }
        cb(null, { newUser })
        return
      }
      if (user.github?.id) {
        cb(new Error('Email already used and binded to another account'))
        return
      }
      user.github = github
      await user.save()
    }

    cb(null, user)
  })
}

const enabled = config.github.clientID && config.github.clientSecret

export default enabled
  ? new GitHubStrategy(
      {
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: `${config.baseUrl}/api/v1/auth/github/callback`,
        scope: ['user:email'],
      },
      verify
    )
  : null
