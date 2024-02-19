import { User } from '@linux-odyssey/models'
import type { Profile } from 'passport'
import type { VerifyCallback } from 'passport-oauth2'

export type SocialLogin = {
  provider: string
  id: string
  displayName: string
}

export default async function oauthVerify(
  provider: string,
  profile: Profile,
  query: Record<string, any>,
  cb: VerifyCallback
) {
  process.nextTick(async () => {
    try {
      const email = profile.emails ? profile.emails[0]?.value : undefined
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
    } catch (err) {
      return cb(
        err instanceof Error ? err : new Error('An unknown error occurred')
      )
    }
  })
}
