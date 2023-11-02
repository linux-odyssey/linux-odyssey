import { validationResult } from 'express-validator'

export function noError(req, res, next) {
  const result = validationResult(req)
  if (result.isEmpty()) {
    next()
    return
  }
  res.status(400).json({
    message: 'Validation failed',
    errors: result.array(),
  })
}
