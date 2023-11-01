import { matchedData } from 'express-validator'
import { User } from '@linux-odyssey/models'
import { genJWT, hashPassword } from '../../utils/auth.js'

export async function issueToken(req, res) {
  const { user } = req
  const token = await genJWT({
    _id: user.id,
    username: user.username,
    email: user.email,
  })
  res.json({ token })
}

export async function register(req, res, next) {
  const { username, password, email } = matchedData(req)

  const user = new User({
    username,
    email,
  })
  try {
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
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'error registering user',
    })
  }
}

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

export async function socialLogin(req, res) {
  const { newUser } = req.user
  if (newUser) {
    req.session.newUser = newUser
    res.redirect('/choose-username')
    return
  }
  res.redirect('/')
}

export async function registerFromSession(req, res) {
  const { username } = matchedData(req)
  const { newUser } = req.session

  if (!newUser) {
    res.status(400).json({
      message: 'no new user found',
    })
    return
  }

  newUser.username = username
  const user = new User(newUser)

  await user.save()

  req.login(user, (err) => {
    if (err) {
      console.error(err)
      res.status(500).json({
        message: 'error logging in',
      })
      return
    }
    delete req.session.newUser
    res.status(201).json({
      message: 'user created',
    })
  })
}
