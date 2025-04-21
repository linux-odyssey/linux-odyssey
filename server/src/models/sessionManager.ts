import { HydratedDocument, Types } from 'mongoose'
import { Session, UserProfile } from '@linux-odyssey/models'
import type { ISession, IUser } from '@linux-odyssey/models'
import { createContainer, deleteContainer } from '../containers/docker.js'
import logger from '../utils/logger.js'
import { questManager } from './quest.js'

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
  const quest = await questManager.get(questId)
  if (!quest) {
    throw new Error(`Quest ${questId} not found`)
  }

  // deactivate all active sessions
  deactivateSessions(user._id, quest.id).catch((err) => {
    logger.error(err)
  })

  const container = await createContainer(
    `quest-${quest.id}-${user.username}-${Date.now()}`,
    quest.id,
    quest.image
  )

  const newSession = new Session({
    user,
    quest,
    containerId: container.id,
  })

  const userProfile = await UserProfile.findOne({ user: user._id })
  if (!userProfile) {
    throw new Error(`UserProfile ${user._id} not found`)
  }

  const progress = userProfile.progress.get(quest.id)
  if (!progress) {
    userProfile.progress.set(quest.id, {
      quest: quest.id,
      sessions: [newSession._id],
      startedAt: new Date(),
      completed: false,
    })
  } else {
    progress.sessions.push(newSession._id)
  }
  await userProfile.save()
  return newSession
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
  const quest = await questManager.get(questId)
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
