import User from '../../models/user.js'
import {
  genJWT,
  hashPassword,
  isValidEmail,
  isValidUsername,
} from '../../utils/auth.js'

export async function issueToken(req, res) {
  const { user } = req
  const token = await genJWT({
    _id: user.id,
    username: user.username,
    email: user.email,
  })
  res.json({ token })
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
    if (await User.exists({ email: cred })) {
      res.status(409).json({
        type: 'email',
        message: `"${cred}" already exists`,
      })
      return
    }
    res.status(200).json({
      type: 'email',
      message: `"${cred}" is available`,
    })
    return
  }
  if (isValidUsername(cred)) {
    if (await User.exists({ username: cred })) {
      res.status(409).json({
        type: 'username',
        message: `"${cred}" already exists`,
      })
      return
    }
    res.status(200).json({
      type: 'username',
      message: `"${cred}" is available`,
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

  if (await User.exists({ username })) {
    res.status(409).json({
      type: 'username',
      message: 'username already exists',
    })
    return
  }

  if (await User.exists({ email })) {
    res.status(409).json({
      type: 'email',
      message: 'username already exists',
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
    res.status(201)
    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: 'error registering user',
    })
  }
}
