import { Router } from 'express'

import { homeController } from './controllers/index.js'
import { userListController } from './controllers/users.js'
import { commandListController } from './controllers/commands.js'

const router = Router()

router.get('/', homeController)
router.get('/users', userListController)
router.get('/commands', commandListController)

export default router
