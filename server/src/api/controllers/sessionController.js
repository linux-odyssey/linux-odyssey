import Session from '../../models/session.js'
import Quest from '../../models/quest.js'

export async function getSessionList(req, res) {
  try {
    const query = { user: req.user.id }
    if (req.query.quest_id) {
      query.quest = req.query.quest_id
    }
    const sessions = await Session.find(query)
    res.json(sessions)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export async function createSession(req, res) {
  const quest = await Quest.findById(req.body.quest_id)
  if (!quest) {
    res.status(400).json({ message: 'Quest not found.' })
    return
  }

  const newSession = new Session({
    user: req.user,
    quest,
  })

  try {
    const session = await newSession.save()
    res.status(201).json(session)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export async function getSessionById(req, res) {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!session) {
      res.status(404).json({ message: 'Session not found.' })
      return
    }

    res.json(session)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function deleteSessionById(req, res) {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!session) {
      res.status(404).json({ message: 'Session not found.' })
      return
    }

    res.status(204).end()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
