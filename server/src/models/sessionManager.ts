import { HydratedDocument, Types } from 'mongoose'
import { Session, Quest, UserProfile } from '@linux-odyssey/models'
import type { ISession, IUser } from '@linux-odyssey/models'
import { createContainer, deleteContainer } from '../containers/docker.js'
import SessionHandler from '../game/sessionHandler.js'
import logger from '../utils/logger.js'

async function deactivateSessions(userId: Types.ObjectId, quest: string) {
  const sessions = await Session.find({
    user: userId,
    quest,
    status: 'active',
  })
  return Promise.all(
    sessions.map((session) => {
      return (
        session.containerId &&
        deleteContainer(session.containerId)
          .catch((err) => logger.error('Failed to delete container', err))
          .finally(() => {
            return Session.findByIdAndUpdate(session._id, {
              $set: { status: 'inactive', containerId: null },
            }).catch((err) => logger.error('Failed to update session', err))
          })
      )
    })
  )
}

export async function createNewSession(
  user: HydratedDocument<IUser>,
  questId: string
): Promise<ISession> {
  const quest = await Quest.findById(questId)
  if (!quest) {
    throw new Error(`Quest ${questId} not found`)
  }

  // deactivate all active sessions
  deactivateSessions(user._id, quest._id).catch((err) => {
    logger.error(err)
  })

  const container = await createContainer(
    `quest-${quest.id}-${user.username}-${Date.now()}`,
    quest.image
  )

  const newSession = new Session({
    user,
    quest,
    containerId: container.id,
  })

  const sessionHandler = new SessionHandler(newSession, quest)

  sessionHandler.addNewTasks()

  const session = sessionHandler.getSession()
  await session.save()

  const userProfile = await UserProfile.findOne({ user: user._id })
  if (!userProfile) {
    throw new Error(`UserProfile ${user._id} not found`)
  }

  const progress = userProfile.progress.get(quest._id)
  if (!progress) {
    userProfile.progress.set(quest._id, {
      quest: quest._id,
      sessions: [session._id],
      startedAt: new Date(),
      completed: false,
    })
  } else {
    progress.sessions.push(session._id)
  }
  await userProfile.save()
  return session
}

export async function getOrCreateActiveSession(
  user: HydratedDocument<IUser>,
  questId: string
): Promise<ISession> {
  const session = await Session.findOne({
    user,
    quest: questId,
    status: 'active',
  })
  if (session) {
    return session
  }
  return createNewSession(user, questId)
}

export async function finishSession(
  session: HydratedDocument<ISession>
): Promise<void> {
  session.status = 'finished'
  await session.save()

  const userProfile = await UserProfile.findOne({ user: session.user })
  if (!userProfile) {
    throw new Error(`UserProfile ${session.user} not found`)
  }

  const progress = userProfile.progress.get(session.quest)
  if (!progress) {
    throw new Error(`Progress ${session.quest} not found`)
  }
  if (!progress.completed) {
    progress.finishedAt = new Date()
    progress.completed = true
  }
  await userProfile.save()
}

export async function isQuestUnlocked(
  user: HydratedDocument<IUser>,
  questId: string
): Promise<boolean> {
  const userProfile = await UserProfile.findOne({ user: user.id })
  if (!userProfile) {
    throw new Error(`UserProfile ${user.id} not found`)
  }
  const quest = await Quest.findById(questId)
  if (!quest) {
    throw new Error(`Quest ${questId} not found`)
  }
  if (!quest.requirements) {
    return true
  }
  return quest.requirements.every((requiredQuestId) => {
    const progress = userProfile.progress.get(requiredQuestId)
    return progress && progress.completed
  })
}
