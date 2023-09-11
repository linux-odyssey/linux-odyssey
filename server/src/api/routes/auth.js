import { Router } from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt'

import User from '../../models/user.js'
import { genUserJWT } from '../../utils/auth.js'

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    try {
      const user = await User.findOne({ username })
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' })
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashedPassword
      )
      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect username or password.' })
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

const router = Router()

async function issueToken(req, res) {
  const token = await genUserJWT(req.user)
  res.json({
    token,
  })
}

router.post(
  '/login/password',
  passport.authenticate('local', { session: false }),
  issueToken
)

export default router
