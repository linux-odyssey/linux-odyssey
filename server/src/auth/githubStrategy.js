import GitHubStrategy from 'passport-github2'

import config from '../config.js'
import oauthVerify from './oauthVerify.js'

function verify(accessToken, refreshToken, profile, cb) {
  oauthVerify('github', profile, { 'socialLogins.github.id': profile.id }, cb)
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
