import passport from 'passport'
import type { Express } from 'express'
import { UserProfile } from '@linux-odyssey/models'
import passwordStrategy from './passwordStrategy.js'
import jwtStrategy from './jwtStrategy.js'
import googleStrategy from './googleStrategy.js'
import githubStrategy from './githubStrategy.js'
import logger from '../utils/logger.js'

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

passport.serializeUser((user: Express.User, done) => {
  process.nextTick(async () => {
    try {
      if (!('id' in user)) {
        // OAuth new user
        done(null, user)
        return
      }
      const { id } = user
      if (!(await UserProfile.exists({ user: id }))) {
        await UserProfile.create({ user: id })
      }
      done(null, user)
    } catch (err) {
      logger.error(err)
      done(err)
    }
  })
})

passport.deserializeUser((user: Express.User, done) => {
  process.nextTick(() => {
    done(null, user)
  })
})

export default enabledMethods
