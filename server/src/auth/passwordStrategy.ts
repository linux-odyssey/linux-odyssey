/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'
import type { IVerifyOptions } from 'passport-local'
import type { Express } from 'express'
import { User } from '@linux-odyssey/models'

async function verifyPassword(
  username: string,
  password: string,
  done: (
    error: any,
    user?: Express.User | false,
    options?: IVerifyOptions
  ) => void
) {
  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    })
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' })
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.hashedPassword || ''
    )
    if (!isPasswordValid) {
      return done(null, false, { message: 'Incorrect username or password.' })
    }
    return done(null, {
      id: user.id,
      username: user.username,
      email: user.email,
    })
  } catch (err) {
    return done(err)
  }
}

export default new LocalStrategy(verifyPassword)
