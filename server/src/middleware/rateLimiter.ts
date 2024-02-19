import rateLimit from 'express-rate-limit'
import type { Options } from 'express-rate-limit'
import type { Request, Response, NextFunction } from 'express'
import config from '../config.js'

function createRateLimiter(options: Partial<Options>) {
  if (config.testing.enabled) {
    return (req: Request, res: Response, next: NextFunction) => next()
  }
  return rateLimit(options)
}

export const globalRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
})

export const authenticateRateLimit = createRateLimiter({
  windowMs: 2 * 60 * 1000,
  max: 5,
})

export const sessionRateLimit = createRateLimiter({
  windowMs: 10 * 1000,
  max: 1,
  keyGenerator: (req: Request) => {
    return req.user ? (req.user as any)._id : req.ip || ''
  },
})
