import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import config from '../config.js'

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
}

function verifyJwt(jwtPayload, done) {
  return done(null, jwtPayload)
}

export default new JwtStrategy(jwtOptions, verifyJwt)
