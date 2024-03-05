import { questList } from '../models/quests.js'
import { Request, Response } from 'express'
// eslint-disable-next-line import/prefer-default-export
export async function questListController(req: Request, res: Response) {
  const quests = await questList()
  quests.forEach((quest) => {
    quest.failed = quest.started - quest.completed
  })
  res.render('quests', { quests })
}
