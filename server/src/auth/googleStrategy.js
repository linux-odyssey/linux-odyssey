import GoogleStrategy from 'passport-google-oidc'

import config from '../config.js'
import User from '../models/user.js'

console.log('Google config:', config.google)

export default new GoogleStrategy(
  {
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: '/api/v1/auth/google/callback',
    scope: ['profile', 'email'],
  },
  function verify(issuer, profile, cb) {
    console.log('Get a google login:', profile)

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
        console.log('Existing user:', user)
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
)
