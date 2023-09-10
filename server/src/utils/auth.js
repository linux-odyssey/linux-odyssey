import jwt from 'jsonwebtoken'
import config from '../config.js'
import User from '../models/user.js'

export async function defaultUser() {
  let user = await User.findOne({ username: 'defaultUser' })
  if (!user) {
    user = new User({
      username: 'defaultUser',
      email: 'jackson@example.com',
    })
    await user.save()
  }
  return user
}

export function genSessionJWT(session) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { session_id: session.id },
      config.jwtSecret,
      { expiresIn: config.expiry },
      (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      }
    )
  })
}

export function verifySessionJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}
