import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../config.js'
import User from '../models/user.js'

export async function createTestUser() {
  let user = await User.findOne({ username: 'testUser' })
  if (!user) {
    user = new User({
      username: 'testUser',
      email: 'test@example.com',
    })
    user.hashedPassword = await bcrypt.hash('testPassword', 10)
    await user.save()
  }
}

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

export function genUserJWT(user) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { _id: user.id, username: user.username, email: user.email },
      config.jwtSecret,
      { expiresIn: config.expiry, issuer: 'linuxodyssey.xyz' },
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
