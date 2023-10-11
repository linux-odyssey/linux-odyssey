import GoogleStrategy from 'passport-google-oidc'

import config from '../config.js'
import User from '../models/user.js'

function verify(issuer, profile, cb) {
  process.nextTick(async () => {
    const email = profile.emails[0]?.value
    if (!email) {
      cb(new Error('No email found'))
      return
    }

    let user = await User.findOne({ 'google.id': profile.id })
    if (!user) {
      user = await User.findOne({ email })
      const google = {
        id: profile.id,
        displayName: profile.displayName,
      }
      if (!user) {
        user = new User({
          email,
          google,
        })
      } else if (user.google?.id) {
        cb(new Error('Email already used and binded to another account'))
        return
      } else {
        user.google = google
      }
      await user.save()
    }

    cb(null, user)
  })
}

const enabled = config.google.clientID && config.google.clientSecret

export default enabled
  ? new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: '/api/v1/auth/google/callback',
        scope: ['profile', 'email'],
      },
      verify
    )
  : null
