import { Router } from 'express'
import passport from 'passport'
import commands from './commandRouter.js'
import authRouter from './authRouter.js'
import authRequired from '../../middleware/authRequired.js'
import config from '../../config.js'
import leaderboardController from '../controllers/leaderboardController.js'

const router = Router()
if (!config.isProduction) {
  router.get('/', (req, res) => {
    res.send('Hello API!')
  })

  router.get('/ip', (req, res) => {
    res.json({ ip: req.ip, forwarded: req.headers['x-forwarded-for'] })
  })
}

router.use('/commands', commands)
router.use('/auth', authRouter)

router.get('/leaderboard', leaderboardController)

export default router
