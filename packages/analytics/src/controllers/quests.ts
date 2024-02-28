import { questList } from '../models/quests.js'
// eslint-disable-next-line import/prefer-default-export
export async function questListController(req: any, res: any) {
  const quests = await questList()
  quests.forEach((quest) => {
    quest.failed = quest.started - quest.completed
  })
  res.render('quests', { quests })
}
