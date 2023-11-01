import { check } from 'express-validator'
import { noError } from '../../middleware/validator.js'

const checkQuestId = () =>
  check('quest_id').notEmpty().isString().isLowercase().isLength({ max: 64 })

export const createSessionValidator = [checkQuestId(), noError]
export const activeSessionValidator = [checkQuestId(), noError]
