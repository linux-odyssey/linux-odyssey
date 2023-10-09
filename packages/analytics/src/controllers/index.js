import { userCount } from '../models/users.js'
import { sessionCount, sessionCompleted } from '../models/quests.js'

// eslint-disable-next-line import/prefer-default-export
export async function homeController(req, res) {
  const payload = {
    title: 'Linux Odyssey Admin',
    userCount: await userCount(),
    sessionCount: await sessionCount(),
    sessionCompleted: await sessionCompleted(),
  }
  payload.completedRate =
    Math.round((payload.sessionCompleted / payload.sessionCount) * 10000) / 100
  res.render('home', payload)
}
