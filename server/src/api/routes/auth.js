import { Router } from 'express'
import passport from 'passport'

import {
  register,
  checkUsername,
  logout,
} from '../controllers/authController.js'

const router = Router()

router.post(
  '/login',
  passport.authenticate('local', { failureMessage: true }),
  (req, res) => {
    res.json({ message: 'success' })
  }
)

router.post('/register', register)

router.post('/logout', logout)

router.get('/check', checkUsername)

export default router
