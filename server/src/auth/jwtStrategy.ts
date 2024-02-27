import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import type { VerifyCallback } from 'passport-jwt'
import config from '../config.js'

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
}

function verifyJwt(jwtPayload: any, done: VerifyCallback) {
  return done(null, jwtPayload)
}

export default new JwtStrategy(jwtOptions, verifyJwt)
