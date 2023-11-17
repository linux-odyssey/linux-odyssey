import { body } from 'express-validator'
import { noError } from '../../middleware/validator.js'

const checkCommand = () => body('command').isString().notEmpty().trim()
const checkPwd = () => body('pwd').isString().notEmpty().trim()
const checkOutput = () => body('output').trim().optional()
const checkError = () => body('error').trim().optional()
const checkParams = () => body('params').isObject().optional()

export const newCommandValidator = [
  checkCommand(),
  checkPwd(),
  checkOutput(),
  checkError(),
  checkParams(),
  noError,
]
