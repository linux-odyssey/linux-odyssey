import { Router } from 'express'
import * as sessionController from '../controllers/sessionController.js'
import { sessionRateLimit } from '../../middleware/rateLimiter.js'
import {
  createSessionValidator,
  activeSessionValidator,
  sessionListValidator,
  sessionDetailValidator,
} from '../validators/sessionValidator.js'

const router = Router()

router.get('/', sessionListValidator, sessionController.getSessionList)
router.post(
  '/',
  createSessionValidator,
  sessionRateLimit,
  sessionController.createSession
)
router.get(
  '/active',
  activeSessionValidator,
  sessionController.getActiveSessionHandler
)
router.get(
  '/:sessionId',
  sessionDetailValidator,
  sessionController.getSessionById
)

export default router
