import { Router } from 'express'
import passport from 'passport'

import {
  register,
  checkUsername,
  checkSession,
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

router.get('/check-username', checkUsername)

router.get('/check-session', checkSession)

router.get('/google', passport.authenticate('google'))

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
)

export default router
