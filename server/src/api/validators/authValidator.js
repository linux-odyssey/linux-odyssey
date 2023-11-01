import { query } from 'express-validator'

import { isValidUsername } from '@linux-odyssey/utils'
import { User } from '@linux-odyssey/models'

export const checkUsername = () =>
  query('username')
    .notEmpty()
    .isString()
    .custom((username) => {
      if (!isValidUsername(username)) {
        throw new Error('Invalid username')
      }
      return true
    })
    .trim()

export const checkNewUsername = () =>
  checkUsername().custom(async (username) => {
    if (await User.exists({ username })) {
      throw new Error('Username taken')
    }
    return true
  })

export const checkEmail = () => query('email').notEmpty().isEmail().trim()

export const checkNewEmail = () =>
  checkEmail().custom(async (email) => {
    if (await User.exists({ email })) {
      throw new Error('Email taken')
    }
    return true
  })

export const checkPassword = () =>
  query('password').notEmpty().isStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 0,
  })
