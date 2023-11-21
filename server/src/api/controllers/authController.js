import { matchedData } from 'express-validator'
import { genJWT } from '../../utils/auth.js'
import { createUser } from '../../models/userManager.js'
import { asyncHandler } from '../../middleware/error.js'
import logger from '../../utils/logger.js'

export const issueToken = asyncHandler(async (req, res) => {
  const { user } = req
  const token = await genJWT({
    _id: user.id,
    username: user.username,
    email: user.email,
  })
  res.json({ token })
})

export const register = asyncHandler(async (req, res, next) => {
  const { username, password, email } = matchedData(req)

  const user = await createUser(username, email, { password })
  req.login(user, (err) => {
    if (err) {
      next(err)
      return
    }
    res.status(201).json({
      message: 'user created',
    })
  })
})

export function logout(req, res) {
  req.logout((err) => {
    if (err) {
      logger.error(err)
      res.status(500).json({
        message: 'error logging out',
      })
      return
    }
    res.status(200).json({
      message: 'logged out',
    })
  })
}

export function checkSession(req, res) {
  res.json({
    loggedIn: req.isAuthenticated() && !req.session.newUser,
  })
}

export function socialLoginHandler(req, res) {
  const { newUser } = req.user
  if (newUser) {
    req.session.newUser = newUser
    res.redirect('/choose-username')
    return
  }
  res.redirect('/')
}

export const registerFromSession = asyncHandler(async (req, res, next) => {
  const { username } = matchedData(req)
  const { newUser } = req.session

  if (!newUser) {
    res.status(401).json({
      message: 'no new user found',
    })
    return
  }

  const { email, socialLogin } = newUser

  if (!socialLogin) {
    throw new Error('Socail Login not found')
  }

  const user = await createUser(username, email, { socialLogin })

  req.login(user, (err) => {
    if (err) {
      next(err)
      return
    }
    delete req.session.newUser
    res.status(201).json({
      message: 'user created',
    })
  })
})
