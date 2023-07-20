import { Router } from 'express'
import sessions from './sessions.js'
import quests from './quests.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello API!')
})

router.use('/sessions', authMiddleware, sessions)
router.use('/quests', quests)

export default router
