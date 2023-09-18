import bcrypt from 'bcrypt'
import LocalStrategy from 'passport-local'
import User from '../models/user.js'

async function verifyPassword(username, password, done) {
  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    })
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)
    if (!isPasswordValid) {
      return done(null, false, { message: 'Incorrect username or password.' })
    }
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}

export default new LocalStrategy(verifyPassword)
