import express from 'express'
import userController from '../controllers/userController.js'
import authRequired from '../../middleware/authRequired.js'

const router = express.Router()

router.get('/me', authRequired, userController.me)

export default router
