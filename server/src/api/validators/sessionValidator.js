import { check } from 'express-validator'
import { checkQuestId } from './questValidator.js'
import { noError } from '../../middleware/validator.js'

const checkSessionStatus = () =>
  check('status')
    .isString()
    .custom((value) => ['active', 'inactive', 'finished'].includes(value))

export const checkSessionId = () =>
  check('sessionId').notEmpty().isString().isMongoId()

export const sessionListValidator = [checkQuestId(), checkSessionStatus()]
export const sessionDetailValidator = [checkSessionId(), noError]
export const createSessionValidator = [checkQuestId(), noError]
export const activeSessionValidator = [checkQuestId(), noError]
