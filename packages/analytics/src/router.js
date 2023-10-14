import { Router } from 'express'

import { homeController } from './controllers/index.js'

const router = Router()

router.get('/', homeController)

export default router
