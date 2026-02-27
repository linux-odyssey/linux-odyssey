import { Router } from 'express'

import { homeController } from './controllers/index'
import { userListController, userDetailController } from './controllers/users'
import { questListController } from './controllers/quests'
import { commandListController } from './controllers/commands'
import {
  sessionDetailController,
  sessionListController,
} from './controllers/sessions'

const router = Router()

router.get('/', homeController)
router.get('/users', userListController)
router.get('/users/:id', userDetailController)
router.get('/quests', questListController)
router.get('/commands', commandListController)
router.get('/sessions', sessionListController)
router.get('/sessions/:id', sessionDetailController)

export default router
