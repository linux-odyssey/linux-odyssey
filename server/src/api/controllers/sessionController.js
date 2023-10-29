import { Session, Quest } from '@linux-odyssey/models'
import { createContainer } from '../../containers/docker.js'
import SessionHandler from '../../game/sessionHandler.js'

function sessionSummary(session) {
  return {
    _id: session._id,
    user: session.user._id || session.user,
    quest: session.quest._id || session.quest,
    status: session.status,
    createdAt: session.createdAt,
    lastActivityAt: session.lastActivityAt,
  }
}

function sessionDetail(session) {
  return {
    ...sessionSummary(session),
    hints: session.hints,
    tasks: session.tasks,
    graph: session.graph,
  }
}

export async function getSessionList(req, res) {
  try {
    const query = { user: req.user._id }
    if (req.query.quest_id) {
      query.quest = req.query.quest_id
    }
    query.status = req.query.status || 'active'
    const sessions = await Session.find(query)
    res.json(sessions.map(sessionSummary))
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

  // deactive all active sessions
  await Session.updateMany(
    { user: req.user._id, quest, status: 'active' },
    { status: 'inactive' }
  )

  try {
    const container = await createContainer(
      `quest-${quest.id}-${req.user.username}-${Date.now()}`
    )
    const newSession = new Session({
      user: req.user,
      quest,
      containerId: container.id,
    })

    const session = new SessionHandler(newSession)
    session.addNewTasks()

    await newSession.save()
    res.status(201).json(sessionDetail(newSession))
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
}

export async function getSessionById(req, res) {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!session) {
      res.status(404).json({ message: 'Session not found.' })
      return
    }

    res.json(sessionDetail(session))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function deleteSessionById(req, res) {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
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
