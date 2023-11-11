import { Quest } from '@linux-odyssey/models'
import { matchedData } from 'express-validator'

export async function getQuests(req, res) {
  const quests = await Quest.find({})
  res.json(
    quests.map(({ title, _id, requirements }) => ({
      _id,
      title,
      requirements,
    }))
  )
}

export async function getQuestDetail(req, res) {
  const { questId } = matchedData(req)
  const quest = await Quest.findById(questId)
  if (!quest) {
    res.status(404).json({ message: 'Quest not found.' })
    return
  }
  const { _id, title, order, instruction } = quest
  res.json({ _id, title, order, instruction })
}
