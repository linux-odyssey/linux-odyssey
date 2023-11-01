import { check } from 'express-validator'

import { isValidUsername, isValidEmail } from '@linux-odyssey/utils'
import { User } from '@linux-odyssey/models'
import { passwordPolicy } from '@linux-odyssey/constants'
import { noError } from '../../middleware/validator.js'

const checkUsername = () =>
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

const checkNewUsername = () =>
  checkUsername().custom(async (username) => {
    if (await User.exists({ username })) {
      throw new Error('Username taken')
    }
    return true
  })

const checkEmail = () => check('email').notEmpty().isString().isEmail().trim()

const checkNewEmail = () =>
  checkEmail().custom(async (email) => {
    if (await User.exists({ email })) {
      throw new Error('Email taken')
    }
    return true
  })

const checkPassword = () =>
  check('password').notEmpty().isStrongPassword(passwordPolicy)

const checkLogin = () =>
  check('username')
    .isString()
    .notEmpty()
    .trim()
    .custom((login) => {
      if (!isValidUsername(login) && !isValidEmail(login)) {
        throw new Error('Invalid login')
      }
      return true
    })

export const registerValidators = [
  checkNewUsername(),
  checkNewEmail(),
  checkPassword(),
  noError,
]

export const registerFromSessionValidators = [checkNewUsername(), noError]

export const loginValidators = [checkLogin(), noError]

export const checkUsernameValidators = [checkUsername(), noError]
