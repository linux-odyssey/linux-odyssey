import passport from 'passport'
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

if (enabledMethods.google) {
  passport.use(googleStrategy)
}

if (enabledMethods.github) {
  passport.use(githubStrategy)
}

passport.serializeUser((user, done) => {
  process.nextTick(async () => {
    try {
      if (user._id && !(await UserProfile.exists({ user: user._id }))) {
        await UserProfile.create({ user: user._id })
      }
      done(null, {
        _id: user._id,
        username: user.username,
        email: user.email,
      })
    } catch (err) {
      done(err)
    }
  })
})

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user)
  })
})

export default enabledMethods
