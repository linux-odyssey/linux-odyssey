import { userCount } from '../models/users.js'
import { totalQuests, totalCompleted } from '../models/profiles.js'

// eslint-disable-next-line import/prefer-default-export
export async function homeController(req, res) {
  const payload = {
    title: 'Linux Odyssey Admin',
    userCount: await userCount(),
    totalQuests: await totalQuests(),
    totalCompleted: await totalCompleted(),
  }
  payload.completedRate =
    Math.round((payload.totalCompleted / payload.totalQuests) * 10000) / 100
  res.render('home', payload)
}
