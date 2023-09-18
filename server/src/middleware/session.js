import session from 'express-session'
import MongoStore from 'connect-mongo'

import config from '../config.js'

export default session({
  secret: config.jwtSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: config.sessionMaxAge,
  },
  store: MongoStore.create({
    mongoUrl: config.db,
    collectionName: 'loginSessions',
  }),
})
