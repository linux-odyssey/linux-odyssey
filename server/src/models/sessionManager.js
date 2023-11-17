import { Session, Quest, UserProfile } from '@linux-odyssey/models'
import { createContainer, deleteContainer } from '../containers/docker.js'
import SessionHandler from '../game/sessionHandler.js'

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
    `quest-${quest.id}-${user.username}-${Date.now()}`,
    quest.image
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
    })
  } else {
    progress.sessions.push(session._id)
  }
  await userProfile.save()
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

export async function finishSession(session) {
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

export async function isQuestUnlocked(user, questId) {
  const userProfile = await UserProfile.findOne({ user: user._id })
  if (!userProfile) {
    throw new Error(`UserProfile ${user._id} not found`)
  }
  const quest = await Quest.findById(questId)
  if (!quest) {
    throw new Error(`Quest ${questId} not found`)
  }
  return quest.requirements.every((requiredQuestId) => {
    const progress = userProfile.progress.get(requiredQuestId)
    return progress && progress.completed
  })
}
