import GoogleStrategy from 'passport-google-oidc'

import config from '../config.js'

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
    return cb(null, profile)
  }
)
