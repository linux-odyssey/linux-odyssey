import type { Express, Request, Response } from 'express'
import { UserProfile } from '@linux-odyssey/models'
import { asyncHandler } from '../../middleware/error.js'

export const me = asyncHandler(async (req: Request, res: Response) => {
  const { id, username, email } = req.user as Express.ExistingUser

  const userProfile = await UserProfile.findOne({
    user: id,
  })
  if (!userProfile) {
    throw new Error(`UserProfile not found for user ${username} ${id}!`)
  }
  const { progress } = userProfile
  res.json({
    username,
    email,
    progress,
  })
})
