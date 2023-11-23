import { check } from 'express-validator'
import { noError } from '../../middleware/validator.js'

export const checkQuestId = () =>
  check('questId').notEmpty().isString().isLowercase().isLength({ max: 64 })

export const questIdValidator = [checkQuestId(), noError]
