import { check } from 'express-validator'
import { noError } from '../../middleware/validator.js'

export const checkQuestId = () =>
  check('questId').notEmpty().isString().isAlphanumeric().isLength({ max: 64 })

export const questIdValidator = [checkQuestId(), noError]

export default {
  questIdValidator,
}
