import { Router, Request, Response } from 'express'
import passport from 'passport'

import enabledMethods from '../../auth/passport.js'

import {
  register,
  checkSession,
  logout,
  registerFromSession,
  socialLoginHandler,
  registerGuest,
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
  (req: Request, res: Response) => {
    res.json({ message: 'success' })
  }
)

router.post('/register', authenticateRateLimit, registerValidators, register)

router.post('/register-guest', authenticateRateLimit, registerGuest)

router.post('/logout', logout)

router.get(
  '/check-username',
  checkUsernameValidators,
  (req: Request, res: Response) => res.json({ available: true })
)
router.get('/check-session', checkSession)

router.get('/available-methods', (req, res) => {
  res.json(enabledMethods)
})

if (enabledMethods.google) {
  router.get(
    '/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
  )
  router.get(
    '/google/callback',
    authenticateRateLimit,
    passport.authenticate('google'),
    socialLoginHandler
  )
}

if (enabledMethods.github) {
  router.get('/github', passport.authenticate('github'))
  router.get(
    '/github/callback',
    authenticateRateLimit,
    passport.authenticate('github'),
    socialLoginHandler
  )
}

router.post(
  '/register-from-session',
  authenticateRateLimit,
  registerFromSessionValidators,
  registerFromSession
)

export default router
