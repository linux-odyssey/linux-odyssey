import { Router } from 'express'
import passport from 'passport'

import {
  issueToken,
  register,
  checkUsername,
} from '../controllers/authController.js'

const router = Router()

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  issueToken
)

router.post('/register', register, issueToken)

router.get('/check', checkUsername)

export default router
