import { Router, Request, Response } from 'express'
import passport from 'passport'
import { recordLogin } from '../../middleware/recordLogin.js'
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
import { NextFunction } from 'express-serve-static-core'
import { rateLimitByAccount } from '../../middleware/rateLimiter.js'
const router = Router()

router.post(
  '/login',
  rateLimitByAccount,
  authenticateRateLimit,
  loginValidators,
  (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(
      'local',
      async (err: unknown, user: Express.User | false, info: any) => {
        if (err) {
          await recordLogin(req, false, 'passport error')
          return next(err)
        }

        if (!user) {
          const msg = info?.message || 'invalid credentials'
          await recordLogin(req, false, msg)
          return res.status(401).json({ message: msg })
        }

        req.logIn(user, async (err: unknown) => {
          if (err) {
            await recordLogin(req, false, 'login session failed')
            return next(err)
          }

          await recordLogin(req, true, 'login success')
          return res.json({ message: 'success' })
        })
      }
    )(req, res, next)
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
