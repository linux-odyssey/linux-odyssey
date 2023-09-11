import { Router } from 'express'
import sessions from './sessions.js'
import quests from './quests.js'
import commands from './commands.js'
import { authMiddleware } from '../../middleware/auth.js'
import authRouter from './auth.js'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello API!')
})

router.use(authRouter)
router.use('/sessions', authMiddleware, sessions)
router.use('/quests', quests)
router.use('/commands', commands)

export default router
