import { Request, Response } from 'express'
import { questList } from '../models/quests'

export async function questListController(req: Request, res: Response) {
  const quests = await questList()
  quests.forEach((quest) => {
    quest.failed = quest.started - quest.completed
  })
  res.render('quests', { quests })
}
