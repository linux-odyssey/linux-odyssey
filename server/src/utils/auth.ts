import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../config.js'

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export function genJWT(payload: { [key: string]: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.secret,
      { expiresIn: config.containerExpiry },
      (err, token) => {
        if (err) {
          reject(err)
        } else if (token === undefined) {
          reject(new Error('Token is undefined'))
        } else {
          resolve(token)
        }
      }
    )
  })
}

export function verifyJWT(token: string): Promise<any> {
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
