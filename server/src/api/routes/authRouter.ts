import { Router, Request, Response, Express } from 'express'
import passport from 'passport'
import { NextFunction } from 'express-serve-static-core'
import { LoginAttempt } from '../../../../packages/models'
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
import {
  authenticateRateLimit,
  rateLimitByAccount,
} from '../../middleware/rateLimiter.js'

const router = Router()

router.post(
  '/login',
  authenticateRateLimit,
  rateLimitByAccount,
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

        req.logIn(user, async (loginErr: unknown) => {
          if (loginErr) {
            await recordLogin(req, false, 'login session failed')
            return next(loginErr)
          }

          await recordLogin(req, true, 'login success')
          return res.json({ message: 'success' })
        })
        return null
      }
    )(req, res, next)
  }
)

async function recordLogin(req: Request, success: boolean, message: string) {
  await LoginAttempt.create({
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
    success,
    time: new Date(),
    username: req.body.username,
    message,
  })
}

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
