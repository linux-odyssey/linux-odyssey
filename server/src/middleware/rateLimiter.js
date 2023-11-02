import rateLimit from 'express-rate-limit'

export const globalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
})

export const authenticateRateLimit = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 5,
})

export const sessionRateLimit = rateLimit({
  windowMs: 10 * 1000,
  max: 1,
  keyGenerator: (req) => {
    return req.user ? req.user._id : req.ip
  },
})
