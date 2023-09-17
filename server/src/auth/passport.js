import passport from 'passport'
import PasswordStrategy from './passwordStrategy.js'

passport.use(PasswordStrategy)

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
