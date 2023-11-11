import { UserProfile } from '@linux-odyssey/models'

export async function me(req, res) {
  const userProfile = await UserProfile.findOne({
    user: req.user._id,
  }).populate('user')
  console.log(userProfile)
  if (!userProfile) {
    res.status(404).json({ message: 'User not found' })
    return
  }
  const {
    user: { username, email },
    progress,
  } = userProfile
  res.json({
    username,
    email,
    progress,
  })
}

export default {
  me,
}
