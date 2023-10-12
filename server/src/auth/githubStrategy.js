import GitHubStrategy from 'passport-github2'

import config from '../config.js'
import User from '../models/user.js'

function verify(accessToken, refreshToken, profile, cb) {
  process.nextTick(async () => {
    console.log(accessToken, refreshToken, profile)
    // cb('todo')
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
        user = new User({
          email,
          github,
        })
      } else if (user.github?.id) {
        cb(new Error('Email already used and binded to another account'))
        return
      } else {
        user.github = github
      }
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
