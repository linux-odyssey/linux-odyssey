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
  checkNewEmail,
  checkNewUsername,
  checkPassword,
} from '../validators/authValidator.js'
import { noError } from '../../middleware/validator.js'

const router = Router()

router.post(
  '/login',
  passport.authenticate('local', { failureMessage: true }),
  (req, res) => {
    res.json({ message: 'success' })
  }
)

router.post(
  '/register',
  checkNewUsername(),
  checkNewEmail(),
  checkPassword(),
  noError,
  register
)

router.post('/logout', logout)

router.get('/check-username', checkNewUsername(), noError, (req, res) =>
  res.json({ available: true })
)
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

router.post(
  '/register-from-session',
  checkNewUsername(),
  noError,
  registerFromSession
)

export default router
