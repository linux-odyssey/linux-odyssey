import { Quest } from '@linux-odyssey/models'
import { matchedData } from 'express-validator'

export async function getQuests(req, res) {
  const quests = await Quest.find({}).sort({ order: 1 })
  res.json(
    quests.map(({ title, order, _id }) => ({
      _id,
      title,
      order,
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
