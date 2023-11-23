import { asyncHandler } from '../../middleware/error.js'
import { leaderboard } from '../../models/userManager.js'

export default asyncHandler(async (req, res) => {
  const users = await leaderboard()
  const response = users.map((user) => ({
    username: user.user.username,
    completedQuests: user.completedQuests,
    score: user.score * 1000,
  }))
  // duplicate the response 100 times
  const fakeResponse = []
  for (let i = 0; i < 100; i++) {
    fakeResponse.push(...response)
  }
  res.json(fakeResponse)
})
