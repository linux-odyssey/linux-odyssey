import rateLimit from 'express-rate-limit'
import type { Options } from 'express-rate-limit'
import type { Request, Response, NextFunction } from 'express'
import config from '../config.js'
import { recordLogin } from './recordLogin.js'
import { LoginAttempt } from '../../../packages/models'

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
export const authenticateRateLimit = config.testing.enabled
  ? (req: Request, res: Response, next: NextFunction) => next()
  : rateLimit({
      windowMs: 1 * 1000,
      max: 5,
      handler: async (req: Request, res: Response, _next: NextFunction) => {
        recordLogin(req, false, 'rate limit')
        res.status(429).json({
          error: 'Too many login attempts. Please try again later.',
        })
      },
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
    time: { $gte: since },
  })

  if (recentFailedCount >= 10) {
    return res.status(429).json({
      error: 'Too many failed login attempts. Please try again later.',
    })
  }

  return next()
}
