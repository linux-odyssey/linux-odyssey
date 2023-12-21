import { userCount } from '../models/users.js'
import { questList } from '../models/quests.js'

// eslint-disable-next-line import/prefer-default-export
export async function homeController(req, res) {
  const quests = await questList()
  const [totalQuests, totalCompleted] = quests.reduce(
    ([total, completed], quest) => [
      total + quest.started,
      completed + quest.completed,
    ],
    [0, 0]
  )

  const payload = {
    title: 'Linux Odyssey Admin',
    userCount: await userCount(),
    totalQuests,
    totalCompleted,
  }
  payload.completedRate =
    Math.round((payload.totalCompleted / payload.totalQuests) * 10000) / 100
  res.render('home', payload)
}
