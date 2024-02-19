import passport from 'passport'
import { UserProfile } from '@linux-odyssey/models'
import type { Express } from 'express'
import passwordStrategy from './passwordStrategy.js'
import jwtStrategy from './jwtStrategy.js'
import googleStrategy from './googleStrategy.js'
import githubStrategy from './githubStrategy.js'
import logger from '../utils/logger.js'

interface SerializedUser extends Express.User {
  _id: string
  username: string
  email: string
}

passport.use(passwordStrategy)
passport.use(jwtStrategy)

const enabledMethods = {
  local: true,
  google: googleStrategy !== null,
  github: githubStrategy !== null,
}

logger.info('Enabled login methods', enabledMethods)

if (googleStrategy !== null) {
  passport.use(googleStrategy)
}

if (githubStrategy !== null) {
  passport.use(githubStrategy)
}

passport.serializeUser((user: Express.User, done: any) => {
  process.nextTick(async () => {
    try {
      const serializedUser = user as SerializedUser
      if (!(await UserProfile.exists({ user: serializedUser._id }))) {
        await UserProfile.create({ user: serializedUser._id })
      }
      done(null, serializedUser)
    } catch (err) {
      done(err)
    }
  })
})

passport.deserializeUser((user: SerializedUser, done) => {
  process.nextTick(() => {
    done(null, user)
  })
})

export default enabledMethods
