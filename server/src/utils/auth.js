import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import config from '../config.js'
import User from '../models/user.js'

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

export function isValidUsername(username) {
  // Define a regular expression pattern for a valid Linux username.
  const usernamePattern = /^[a-z][a-z0-9_-]*$/

  // Test the username against the pattern.
  if (!usernamePattern.test(username)) return false

  // check if the username is between 1 and 32 characters
  if (username.length < 4 || username.length > 32) {
    return false
  }

  const reservedWords = [
    'root',
    'admin',
    'administrator',
    'sysadmin',
    'system',
    'daemon',
    'bin',
    'nobody',
    'nogroup',
    'guest',
    'user',
  ]
  if (reservedWords.includes(username)) {
    return false
  }
  return true
}

export function isValidEmail(email) {
  // Define a regular expression pattern for a valid email address.
  const emailPattern = /^[\w-.+]+@([\w][\w-]*\.)+[\w-]{2,}$/

  // Test the email against the pattern.
  return emailPattern.test(email)
}
