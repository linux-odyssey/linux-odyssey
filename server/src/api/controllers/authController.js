import { isValidEmail, isValidUsername } from '@linux-odyssey/utils'
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

async function invalidUsername(username) {
  return !isValidUsername(username) || User.exists({ username })
}

async function invalidEmail(email) {
  return !isValidEmail(email) || User.exists({ email })
}

export async function checkUsername(req, res) {
  const { username, email } = req.query
  const cred = username || email
  if (!cred) {
    res.status(400).json({
      message: 'username or email is required',
    })
    return
  }

  if (isValidEmail(cred)) {
    res.json({
      type: 'email',
      available: !(await User.exists({ email: cred })),
    })
    return
  }
  if (isValidUsername(cred)) {
    res.json({
      type: 'username',
      available: !(await User.exists({ username: cred })),
    })
    return
  }
  res.status(400).json({
    message: 'invalid username or email',
  })
}

export async function register(req, res, next) {
  const { username, password, email } = req.body
  if (!(username && password && email)) {
    res.status(400).json({
      message: 'username, password, and email are required',
    })
    return
  }

  if (await invalidUsername(username)) {
    res.status(409).json({
      type: 'username',
      message: 'Invalid username',
    })
    return
  }

  if (await invalidEmail(email)) {
    res.status(409).json({
      type: 'email',
      message: 'Invalid email',
    })
    return
  }

  const user = new User({
    username,
    email,
  })
  try {
    user.hashedPassword = await hashPassword(password)
    await user.save()
    req.user = user
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
  const { username } = req.body
  const { newUser } = req.session

  if (!newUser) {
    res.status(400).json({
      message: 'no new user found',
    })
    return
  }

  if (await invalidUsername(username)) {
    res.status(409).json({
      type: 'username',
      message: 'Invalid username',
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
