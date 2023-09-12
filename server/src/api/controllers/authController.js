import User from '../../models/user.js'
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

export async function checkUsername(req, res) {
  const { username } = req.query
  const exists = await User.exists({ username })
  if (exists) {
    res.status(409).json({
      message: `"${username}" already exists`,
    })
  } else {
    res.status(200).json({
      message: `"${username}" is available`,
    })
  }
}

export async function register(req, res, next) {
  const { username, password, email } = req.body
  if (!(username && password && email)) {
    res.status(400).json({
      message: 'username, password, and email are required',
    })
    return
  }
  if (await User.exists({ $or: [{ username }, { email }] })) {
    res.status(409).json({
      message: 'username or email already exists',
    })
    return
  }
  const user = new User({
    username,
    email,
  })
  user.hashedPassword = await hashPassword(password)
  await user.save()
  req.user = user
  res.status(201)
  next()
}
