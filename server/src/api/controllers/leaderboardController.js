import { asyncHandler } from '../../middleware/error.js'

export default asyncHandler(async (req, res) => {
  res.json({ message: 'leaderboard' })
})
