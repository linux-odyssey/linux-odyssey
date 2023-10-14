import { Router } from 'express'

import { homeController } from './controllers/index.js'
import { userListController } from './controllers/users.js'
import { commandListController } from './controllers/commands.js'
import {
  sessionDetailController,
  sessionListController,
} from './controllers/sessions.js'

const router = Router()

router.get('/', homeController)
router.get('/users', userListController)
router.get('/commands', commandListController)
router.get('/sessions', sessionListController)
router.get('/sessions/:id', sessionDetailController)

export default router
