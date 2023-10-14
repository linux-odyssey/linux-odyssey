import jwt from 'jsonwebtoken'
import { User } from '@linux-odyssey/models'
import bcrypt from 'bcrypt'
import config from '../config.js'

export function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function createTestUser() {
  let user = await User.findOne({ username: 'alex' })
  if (!user) {
    user = new User({
      username: 'alex',
      email: 'alex@example.com',
    })
    user.hashedPassword = await hashPassword('123456')
    await user.save()
  }
}

export function genJWT(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.jwtSecret,
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
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}
