/* eslint-disable import/prefer-default-export */
import { defaultUser } from '../utils/auth.js'

export async function authMiddleware(req, res, next) {
  try {
    req.user = await defaultUser()
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
