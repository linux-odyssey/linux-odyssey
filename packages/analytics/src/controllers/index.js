import { userCount } from '../models/users.js'
import { questCount, questCompleted } from '../models/profiles.js'

// eslint-disable-next-line import/prefer-default-export
export async function homeController(req, res) {
  const payload = {
    title: 'Linux Odyssey Admin',
    userCount: await userCount(),
    questCount: await questCount(),
    questCompleted: await questCompleted(),
  }
  payload.completedRate =
    Math.round((payload.questCompleted / payload.questCount) * 10000) / 100
  res.render('home', payload)
}
