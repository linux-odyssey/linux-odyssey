import express from 'express'
import { me } from '../controllers/userController.js'
import authRequired from '../../middleware/authRequired.js'

const router = express.Router()

router.get('/me', authRequired, me)

export default router
