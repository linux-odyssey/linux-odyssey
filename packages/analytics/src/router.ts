import { Router } from 'express'

import { homeController } from './controllers/index.js'
import {
  userListController,
  userDetailController,
} from './controllers/users.js'
import { questListController } from './controllers/quests.ts'
import { commandListController } from './controllers/commands.ts'
import {
  sessionDetailController,
  sessionListController,
} from './controllers/sessions.ts'

const router = Router()

router.get('/', homeController)
router.get('/users', userListController)
router.get('/users/:id', userDetailController)
router.get('/quests', questListController)
router.get('/commands', commandListController)
router.get('/sessions', sessionListController)
router.get('/sessions/:id', sessionDetailController)

export default router
