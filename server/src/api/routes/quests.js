import { Router } from 'express'
import * as questController from '../controllers/questController.js'

const router = Router()

router.get('/', questController.getQuests)
router.get('/:id', questController.getQuestDetail)

export default router
