import { Router } from 'express'
import * as questController from '../controllers/questController.js'

const router = Router()

router.get('/', questController.getQuests)
router.get('/:name', questController.getQuestDetail)

export default router
