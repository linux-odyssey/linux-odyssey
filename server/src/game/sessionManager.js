import { Session, Quest } from '@linux-odyssey/models'
import { createContainer, deleteContainer } from '../containers/docker.js'
import SessionHandler from './sessionHandler.js'

async function deactivateSessions(user, quest) {
  const sessions = await Session.find({
    user,
    quest,
    status: 'active',
  })
  return Promise.all(
    sessions.map((session) => {
      return deleteContainer(session.containerId)
        .catch(console.error)
        .finally(() => {
          session.status = 'inactive'
          session.containerId = null
          return session.save()
        })
    })
  )
}

export async function createNewSession(user, questId) {
  const quest = await Quest.findById(questId)
  if (!quest) {
    throw new Error(`Quest ${questId} not found`)
  }

  // deactivate all active sessions
  deactivateSessions(user._id, quest._id).catch((err) => {
    console.error(err)
  })

  const container = await createContainer(
    `quest-${quest.id}-${user.username}-${Date.now()}`
  )

  const sessionHandler = new SessionHandler(
    new Session({
      user,
      quest,
      containerId: container.id,
    })
  )

  sessionHandler.addNewTasks()

  const session = sessionHandler.getSession()
  await session.save()
  return session
}

export async function getOrCreateActiveSession(user, questId) {
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
