import rateLimit from 'express-rate-limit'
import type { Options } from 'express-rate-limit'
import type { Request, Response, NextFunction } from 'express'
import config from '../config.js'
import { LoginAttempt } from '../../../packages/models'
import logger from '../utils/logger.js'

function createRateLimiter(options: Partial<Options>) {
  if (config.testing.enabled) {
    return (req: Request, res: Response, next: NextFunction) => next()
  }
  return rateLimit(options)
}

export const globalRateLimit = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
})

export const authenticateRateLimit = createRateLimiter({
  windowMs: 10 * 1000,
  max: 5,
})

export const sessionRateLimit = createRateLimiter({
  windowMs: 10 * 1000,
  max: 1,
  keyGenerator: (req: Request) => {
    return req.user ? (req.user as any)._id : req.ip || ''
  },
})

export async function rateLimitByAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const username = req.body.username?.trim()
  if (!username) {
    return next()
  }

  const since = new Date(Date.now() - 10 * 60 * 1000)

  const recentFailedCount = await LoginAttempt.countDocuments({
    username,
    success: false,
    ip: req.ip,
    time: { $gte: since },
  })

  if (recentFailedCount >= 5) {
    logger.warn(
      `Too many failed login attempts for "${username}" from ${req.ip}`
    )
    return res.status(429).json({
      error: 'Too many failed login attempts. Please try again later.',
    })
  }

  return next()
}
