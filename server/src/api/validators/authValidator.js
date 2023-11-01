import { check } from 'express-validator'

import { isValidUsername } from '@linux-odyssey/utils'
import { User } from '@linux-odyssey/models'
import { passwordPolicy } from '@linux-odyssey/constants'

export const checkUsername = () =>
  check('username')
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

export const checkEmail = () => check('email').notEmpty().isEmail().trim()

export const checkNewEmail = () =>
  checkEmail().custom(async (email) => {
    if (await User.exists({ email })) {
      throw new Error('Email taken')
    }
    return true
  })

export const checkPassword = () =>
  check('password').notEmpty().isStrongPassword(passwordPolicy)
