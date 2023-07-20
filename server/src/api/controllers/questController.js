import Quest from '../../models/quest.js'

export async function getQuests(req, res) {
  const quests = await Quest.find({}).sort({ order: 1 })
  res.json(
    quests.map(({ name, title, order, _id }) => ({
      _id,
      name,
      title,
      order,
    }))
  )
}

export async function getQuestDetail(req, res) {
  const { id } = req.params
  const quest = await Quest.findById(id)
  if (!quest) {
    res.status(404).json({ message: 'Quest not found.' })
    return
  }
  res.json(quest)
}
