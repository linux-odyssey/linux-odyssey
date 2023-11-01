import { validationResult } from 'express-validator'

export function noError(req, res, next) {
  const result = validationResult(req)
  if (result.isEmpty()) {
    next()
    return
  }
  console.log(result.array())
  res.status(400).json({
    errors: result.array(),
  })
}
