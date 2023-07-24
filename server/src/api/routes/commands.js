import { Router } from 'express'
import * as commandController from '../controllers/commandController.js'

const router = Router()

router.post('/', commandController.newCommand)

export default router
