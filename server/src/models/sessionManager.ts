import { HydratedDocument } from 'mongoose'
import { Session, UserProfile } from '../../../packages/models'
import type { ISession, IUser } from '../../../packages/models'
import {
  createContainer,
  deleteContainer,
  getAndStartContainer,
} from '../containers/docker.js'
import logger from '../utils/logger.js'
import { questManager } from './quest.js'

async function deactivateSessions(userId: string, quest: string) {
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
  userId: string,
  questId: string
): Promise<ISession> {
  const quest = await questManager.get(questId)
  if (!quest) {
    throw new Error(`Quest ${questId} not found`)
  }

  // deactivate all active sessions
  deactivateSessions(userId, quest.id).catch((err) => {
    logger.error(err)
  })

  const userProfile = await UserProfile.findOne({ user: userId }).populate<{
    user: IUser
  }>('user')
  if (!userProfile) {
    throw new Error(`UserProfile ${userId} not found`)
  }

  const containerName = `quest-${quest.id}-${userProfile.user.username}-${Date.now()}`

  const container = await createContainer(containerName, quest.id, quest.image)
  await getAndStartContainer(container.id)

  const newSession = new Session({
    user: userId,
    quest: quest.id,
    containerId: container.id,
    containerName,
  })

  console.log('container', container.id)
  console.log('containerName', `http://localhost/terminal/${containerName}`)

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
  await newSession.save()
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
  if (session.containerId) {
    deleteContainer(session.containerId)
      .catch((err) => logger.error('Failed to delete container', err))
      .finally(() => {
        return Session.findByIdAndUpdate(session._id, {
          $set: { containerId: null },
        }).catch((err) => logger.error('Failed to update session', err))
      })
  }
}

export async function isQuestUnlocked(
  userId: string,
  questId: string
): Promise<boolean> {
  const userProfile = await UserProfile.findOne({ user: userId })
  if (!userProfile) {
    throw new Error(`UserProfile ${userId} not found`)
  }
  const quest = await questManager.get(questId)
  if (!quest) {
    throw new Error(`Quest ${questId} not found`)
  }
  if (!quest.requirements) {
    return true
  }
  return quest.requirements.every((requiredQuestId: string) => {
    const progress = userProfile.progress.get(requiredQuestId)
    return progress && progress.completed
  })
}
