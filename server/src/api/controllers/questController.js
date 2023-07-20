import Quest from '../../models/quest.js'

export async function getQuests(req, res) {
  const quests = await Quest.find({}).sort({ order: 1 })
  res.json(
    quests.map(({ name, title, order, _id }) => ({
      id: _id,
      name,
      title,
      order,
    }))
  )
}

export async function getQuestDetail(req, res) {
  const { name } = req.params
  const quest = await Quest.findOne({ name })
  if (!quest) {
    res.status(404).json({ message: 'Quest not found.' })
    return
  }
  res.json(quest)
}
