import type { Request, Response, NextFunction } from 'express'

export default function authRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated() && !('newUser' in req.user)) {
    next()
    return
  }
  res.status(401).json({
    message: 'not authenticated',
  })
}
