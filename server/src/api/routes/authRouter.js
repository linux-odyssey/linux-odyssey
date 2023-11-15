import { Router } from 'express'
import passport from 'passport'

import enabledMethods from '../../auth/passport.js'

import {
  register,
  checkSession,
  logout,
  socialLogin,
  registerFromSession,
} from '../controllers/authController.js'
import {
  checkUsernameValidators,
  loginValidators,
  registerFromSessionValidators,
  registerValidators,
} from '../validators/authValidator.js'
import { authenticateRateLimit } from '../../middleware/rateLimiter.js'

const router = Router()

router.post(
  '/login',
  authenticateRateLimit,
  loginValidators,
  passport.authenticate('local', { failureMessage: true }),
  (req, res) => {
    res.json({ message: 'success' })
  }
)

router.post('/register', authenticateRateLimit, registerValidators, register)

router.post('/logout', logout)

router.get('/check-username', checkUsernameValidators, (req, res) =>
  res.json({ available: true })
)
router.get('/check-session', checkSession)

router.get('/available-methods', (req, res) => {
  res.json(enabledMethods)
})

if (enabledMethods.google) {
  router.get('/google', passport.authenticate('google'))
  router.get(
    '/google/callback',
    authenticateRateLimit,
    passport.authenticate('google'),
    socialLogin
  )
}

if (enabledMethods.github) {
  router.get('/github', passport.authenticate('github'))
  router.get(
    '/github/callback',
    authenticateRateLimit,
    passport.authenticate('github'),
    socialLogin
  )
}

router.post(
  '/register-from-session',
  authenticateRateLimit,
  registerFromSessionValidators,
  registerFromSession
)

export default router
