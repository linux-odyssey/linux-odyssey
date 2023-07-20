import Session from '../../models/session.js'
import Quest from '../../models/quest.js'

export async function getSessionList(req, res) {
  try {
    const sessions = await Session.find({ user: req.user.id })
    res.json(sessions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function createSession(req, res) {
  const quest = await Quest.findOne({ name: req.body.quest_name })
  const newSession = new Session({
    user: req.user,
    quest,
  })

  console.log(newSession)

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
      _id: req.params.session_id,
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
      _id: req.params.session_id,
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
