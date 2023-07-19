/* eslint-disable import/prefer-default-export */
import User from '../models/user.js'

export async function authMiddleware(req, res, next) {
  try {
    let user = await User.findOne({ username: 'defaultUser' })
    if (!user) {
      user = new User({
        username: 'defaultUser',
        email: 'john@example.com',
      })
      await user.save()
    }
    req.user = user
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
