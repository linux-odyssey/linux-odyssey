import session from 'express-session'
import MongoStore from 'connect-mongo'

import config from '../config.js'

export default session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    domain: config.domain,
    httpOnly: true,
    secure: config.protocol === 'https:',
    sameSite: 'strict',
    maxAge: config.sessionMaxAge,
  },
  store: MongoStore.create({
    mongoUrl: config.db,
    collectionName: 'loginSessions',
  }),
})
