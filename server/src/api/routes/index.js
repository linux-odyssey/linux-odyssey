import { Router } from 'express'
import passport from 'passport'
import sessions from './sessions.js'
import quests from './quests.js'
import commands from './commands.js'
import authRouter from './auth.js'

const router = Router()
router.use(passport.authenticate('session'))

router.get('/', (req, res) => {
  res.send('Hello API!')
})

router.use('/auth', authRouter)
router.use('/quests', quests)

const authZone = Router()
authZone.use('/sessions', sessions)
authZone.use('/commands', commands)

router.use(authZone)

export default router
