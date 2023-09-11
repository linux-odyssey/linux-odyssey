import { Router } from 'express'
import passport from 'passport'

import { genJwt } from '../../utils/auth.js'

const router = Router()

async function issueToken(req, res) {
  const { user } = req
  const token = await genJwt({
    _id: user.id,
    username: user.username,
    email: user.email,
  })
  res.json({ token })
}

router.post(
  '/login/password',
  passport.authenticate('local', { session: false }),
  issueToken
)

export default router
