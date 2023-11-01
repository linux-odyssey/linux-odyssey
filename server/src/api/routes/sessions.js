import { Router } from 'express'
import * as sessionController from '../controllers/sessionController.js'
import { sessionRateLimit } from '../../middleware/rateLimiter.js'
import {
  createSessionValidator,
  activeSessionValidator,
} from '../validators/sessionValidator.js'

const router = Router()

router.get('/', sessionController.getSessionList)
router.post(
  '/',
  createSessionValidator,
  sessionRateLimit,
  sessionController.createSession
)
router.post(
  '/active',
  activeSessionValidator,
  sessionController.getOrCreateSession
)
router.get('/:id', sessionController.getSessionById)
router.delete('/:id', sessionController.deleteSessionById)

export default router
