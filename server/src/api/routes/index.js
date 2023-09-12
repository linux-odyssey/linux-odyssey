import { Router } from 'express'
import passport from 'passport'
import sessions from './sessions.js'
import quests from './quests.js'
import commands from './commands.js'
import authRouter from './auth.js'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello API!')
})

router.use('/auth', authRouter)
router.use('/quests', quests)
router.use(
  '/sessions',
  passport.authenticate('jwt', { session: false }),
  sessions
)
router.use(
  '/commands',
  passport.authenticate('jwt', { session: false }),
  commands
)

export default router
