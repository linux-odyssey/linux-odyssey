import { UserProfile } from '@linux-odyssey/models'
import { asyncHandler } from '../../middleware/error.js'

export const me = asyncHandler(async (req, res) => {
  const userProfile = await UserProfile.findOne({
    user: req.user._id,
  })
  if (!userProfile) {
    throw new Error(
      `UserProfile not found for user ${req.user.username} ${req.user._id}!`
    )
  }
  const { username, email } = req.user
  const { progress } = userProfile
  res.json({
    username,
    email,
    progress,
  })
})
