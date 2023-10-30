import { Router } from 'express'
import passport from 'passport'
import sessions from './sessions.js'
import quests from './quests.js'
import commands from './commands.js'
import authRouter from './auth.js'
import authRequired from '../../middleware/authRequired.js'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello API!')
})

router.get('/ip', (req, res) => {
  res.json({ ip: req.ip })
})

router.use('/auth', authRouter)
router.use('/quests', quests)

router.use('/sessions', authRequired, sessions)
router.use(
  '/commands',
  passport.authenticate('jwt', { session: false }),
  authRequired,
  commands
)

export default router
