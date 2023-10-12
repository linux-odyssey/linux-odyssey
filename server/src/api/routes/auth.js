import { Router } from 'express'
import passport from 'passport'

import enabledMethods from '../../auth/passport.js'

import {
  register,
  checkUsername,
  checkSession,
  logout,
  socialLogin,
  registerFromSession,
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

router.get('/available-methods', (req, res) => {
  res.json(enabledMethods)
})

if (enabledMethods.google) {
  router.get('/google', passport.authenticate('google'))
  router.get('/google/callback', passport.authenticate('google'), socialLogin)
}

if (enabledMethods.github) {
  router.get('/github', passport.authenticate('github'))
  router.get('/github/callback', passport.authenticate('github'), socialLogin)
}

router.post('/register-from-session', registerFromSession)

export default router
