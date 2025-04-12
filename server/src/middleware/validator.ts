import { validationResult } from 'express-validator'
import type { Request, Response, NextFunction } from 'express'
import { recordLogin } from './recordLogin.js'


export function noError(req: Request, res: Response, next: NextFunction) {
  const result = validationResult(req)
  if (result.isEmpty()) {
    next()
    return
  }
  recordLogin(req, false, 'valid error'); 
  res.status(400).json({
    message: 'Validation failed',
    errors: result.array(),
  })
}
