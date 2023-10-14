import GoogleStrategy from 'passport-google-oidc'

import config from '../config.js'
import oauthVerify from './oauthVerify.js'

function verify(issuer, profile, cb) {
  oauthVerify('google', profile, { 'google.id': profile.id }, cb)
}

const enabled = config.google.clientID && config.google.clientSecret

export default enabled
  ? new GoogleStrategy(
      {
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: `${config.baseUrl}/api/v1/auth/google/callback`,
        scope: ['profile', 'email'],
      },
      verify
    )
  : null
