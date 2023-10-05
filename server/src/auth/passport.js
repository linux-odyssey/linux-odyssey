import passport from 'passport'
import passwordStrategy from './passwordStrategy.js'
import jwtStrategy from './jwtStrategy.js'
import googleStrategy from './googleStrategy.js'

passport.use(passwordStrategy)
passport.use(jwtStrategy)

const enabledMethods = {
  local: true,
  google: googleStrategy !== null,
}

console.log('Enabled login methods', enabledMethods)

if (enabledMethods.google) {
  passport.use(googleStrategy)
}

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, {
      _id: user._id,
      username: user.username,
      email: user.email,
    })
  })
})

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user)
  })
})

export default enabledMethods
