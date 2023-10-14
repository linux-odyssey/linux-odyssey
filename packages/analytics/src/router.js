import { Router } from 'express'

import { homeController } from './controllers/index.js'
import { userListController } from './controllers/users.js'

const router = Router()

router.get('/', homeController)
router.get('/users', userListController)

export default router
