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
    const { questId, status } = matchedData(req)
    if (questId) {
      query.quest = questId
    }
    query.status = status || 'active'
    const sessions = await Session.find(query)
    res.json(sessions.map(sessionSummary))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export async function createSession(req, res) {
  const { questId } = matchedData(req)
  try {
    const session = await createNewSession(req.user, questId)
    res.status(201).json(sessionDetail(session))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export async function getSessionById(req, res) {
  try {
    const { sessionId } = matchedData(req)
    const session = await Session.findOne({
      _id: sessionId,
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

export async function getOrCreateSession(req, res) {
  const { questId } = matchedData(req)
  try {
    const session = await getOrCreateActiveSession(req.user, questId)
    res.json(sessionDetail(session))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}
