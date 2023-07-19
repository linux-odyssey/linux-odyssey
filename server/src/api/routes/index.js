import { Router } from 'express'
import sessions from './sessions.js'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello API!')
})

router.use('/sessions', sessions)

export default router
