import { check } from 'express-validator'
import { noError } from '../../middleware/validator.js'

const checkSessionStatus = () =>
  check('status').isString().isIn(['active', 'inactive', 'finished'])

export const checkSessionId = () =>
  check('sessionId').notEmpty().isString().isMongoId()

export const sessionListValidator = [checkSessionStatus()]
export const sessionDetailValidator = [checkSessionId()]
export const createSessionValidator = [noError]
export const activeSessionValidator = [noError]
