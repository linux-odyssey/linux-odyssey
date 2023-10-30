import { rateLimit } from 'express-rate-limit'

export default rateLimit({
  windowMs: 10 * 1000,
  max: 1,
  keyGenerator: (req) => {
    return req.user ? req.user._id : req.ip
  },
})
