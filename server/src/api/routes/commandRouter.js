import { Router } from 'express'
import * as commandController from '../controllers/commandController.js'

const router = Router()

router.post('/', commandController.newCommand)
router.post('/completed', commandController.completedCommand)

export default router
