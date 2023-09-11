import passport from 'passport'
import PasswordStrategy from './passwordStrategy.js'
import JwtStrategy from './jwtStrategy.js'

passport.use(PasswordStrategy)
passport.use(JwtStrategy)
