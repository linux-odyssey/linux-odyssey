import type { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger.js'

export function asyncHandler(fn: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }
}

// eslint-disable-next-line no-unused-vars
export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) {
  logger.error(err) // Log error stack trace to the console
  res.status(500).send({ message: 'Something broke!' }) // Send error response
}
