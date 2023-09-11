import { Router } from 'express'
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import sessions from './sessions.js'
import quests from './quests.js'
import commands from './commands.js'
import authRouter from './auth.js'
import config from '../../config.js'

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
  issuer: 'linuxodyssey.xyz',
}

passport.use(
  new JwtStrategy(jwtOptions, function verifyJwt(jwtPayload, done) {
    return done(null, jwtPayload)
  })
)

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello API!')
})

router.use(authRouter)
router.use(
  '/sessions',
  passport.authenticate('jwt', { session: false }),
  sessions
)
router.use('/quests', quests)
router.use('/commands', commands)

export default router
