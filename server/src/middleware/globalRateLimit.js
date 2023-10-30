import { rateLimit } from 'express-rate-limit'

export default rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
})
