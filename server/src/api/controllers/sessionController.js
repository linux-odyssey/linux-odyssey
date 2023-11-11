import { matchedData } from 'express-validator'
import { Session } from '@linux-odyssey/models'
import {
  createNewSession,
  getOrCreateActiveSession,
} from '../../game/sessionManager.js'
import { asyncHandler } from '../../middleware/error.js'

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

export const getSessionList = asyncHandler(async (req, res) => {
  const query = { user: req.user._id }
  const { questId, status } = matchedData(req)
  if (questId) {
    query.quest = questId
  }
  query.status = status || 'active'
  const sessions = await Session.find(query)
  res.json(sessions.map(sessionSummary))
})

export const createSession = asyncHandler(async (req, res) => {
  const { questId } = matchedData(req)
  const session = await createNewSession(req.user, questId)
  res.status(201).json(sessionDetail(session))
})

export const getSessionById = asyncHandler(async (req, res) => {
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
})

export const getOrCreateSession = asyncHandler(async (req, res) => {
  const { questId } = matchedData(req)
  const session = await getOrCreateActiveSession(req.user, questId)
  res.json(sessionDetail(session))
})
