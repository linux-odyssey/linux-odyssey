import rateLimit from 'express-rate-limit'
import type { Options } from 'express-rate-limit'
import type { Request, Response, NextFunction } from 'express'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { TRPCError } from '@trpc/server'
import { LoginAttempt } from '@odyssey/models'
import config from '../config.js'
import logger from '../utils/logger.js'
import { middleware } from '../trpc.js'

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

export function trpcRateLimit({
  points,
  duration,
}: {
  points: number
  duration: number
}) {
  const limiter = new RateLimiterMemory({ points, duration })
  return middleware(async (opts) => {
    if (config.testing.enabled) {
      return opts.next()
    }
    const key = opts.ctx.user?.id ?? opts.ctx.ip ?? ''
    try {
      await limiter.consume(key)
    } catch {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests. Please try again later.',
      })
    }
    return opts.next()
  })
}

export const sessionRateLimit = trpcRateLimit({ points: 3, duration: 60 })

export async function rateLimitByAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const username = req.body.username?.trim()
  if (!username) {
    return next()
  }

  const since = new Date(Date.now() - config.rateLimit.lockoutTime)

  const recentFailedCount = await LoginAttempt.countDocuments({
    username,
    success: false,
    ip: req.ip,
    time: { $gte: since },
  })

  if (recentFailedCount >= config.rateLimit.maxFailedAttempts) {
    logger.warn(
      `Too many failed login attempts for "${username}" from ${req.ip}`
    )
    return res.status(429).json({
      error: 'Too many failed login attempts. Please try again later.',
    })
  }

  return next()
}
