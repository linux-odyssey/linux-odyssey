import { matchedData } from 'express-validator'
import { Session } from '@linux-odyssey/models'
import {
  createNewSession,
  getOrCreateActiveSession,
} from '../../game/sessionManager.js'

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
  const { quest_id } = matchedData(req)
  try {
    const session = await createNewSession(req.user, quest_id)
    res.status(201).json(sessionDetail(session))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
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

export async function getOrCreateSession(req, res) {
  const { quest_id } = matchedData(req)
  try {
    const session = await getOrCreateActiveSession(req.user, quest_id)
    res.json(sessionDetail(session))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}
