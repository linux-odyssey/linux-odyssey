import { Router } from 'express'
import * as commandController from '../controllers/commandController.js'
import { newCommandValidator } from '../validators/commandValidator.js'

const router = Router()

router.post('/', newCommandValidator, commandController.newCommand)
router.post('/completed', commandController.completedCommand)

export default router
