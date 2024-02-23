import { Router } from 'express'
import * as questController from '../controllers/questController.js'
import { questIdValidator } from '../validators/questValidator.js'

const router = Router()

router.get('/', questController.getQuests)
router.get('/:questId', questIdValidator, questController.getQuestDetail)

export default router
