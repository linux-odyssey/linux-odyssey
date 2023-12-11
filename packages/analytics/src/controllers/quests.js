import { questList } from '../models/quests.js'

// eslint-disable-next-line import/prefer-default-export
export async function questListController(req, res) {
  const quests = await questList()
  res.render('quests', { quests })
}
