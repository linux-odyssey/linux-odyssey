import { Strategy as GitHubStrategy } from 'passport-github2'
import type { Profile } from 'passport'
import type { VerifyCallback } from 'passport-oauth2'

import config from '../config.js'
import oauthVerify from './oauthVerify.js'

function verify(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  cb: VerifyCallback
) {
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
