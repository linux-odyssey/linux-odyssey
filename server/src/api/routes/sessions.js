import { Router } from 'express'
import * as sessionController from '../controllers/sessionController.js'

const router = Router()

router.get('/', sessionController.getSessionList)
router.post('/', sessionController.createSession)
router.get('/:id', sessionController.getSessionById)
router.delete('/:id', sessionController.deleteSessionById)

export default router
