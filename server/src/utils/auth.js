import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../config.js'

export function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export function genJWT(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.secret,
      { expiresIn: config.containerExpiry },
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

export function verifyJWT(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}
