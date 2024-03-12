import { userCount } from '../models/users.js'
import { questList } from '../models/quests.js'
import { Request, Response } from 'express'
// eslint-disable-next-line import/prefer-default-export
export async function homeController(req: Request, res: Response) {
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
    completedRate: Math.round((totalCompleted / totalQuests) * 10000) / 100,
  }
  res.render('home', payload)
}
