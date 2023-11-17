import { matchedData } from 'express-validator'
import { User } from '@linux-odyssey/models'
import { genJWT, hashPassword } from '../../utils/auth.js'
import { asyncHandler } from '../../middleware/error.js'

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

  const user = new User({
    username,
    email,
  })
  user.hashedPassword = await hashPassword(password)
  await user.save()
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
      console.error(err)
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

export function socialLogin(req, res) {
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

  newUser.username = username
  const user = new User(newUser)

  await user.save()

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
