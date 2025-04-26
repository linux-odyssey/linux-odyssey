import schedule from 'node-schedule'
import type { HydratedDocument } from 'mongoose'
import { Session } from '../../../packages/models'
import type { ISession } from '../../../packages/models'
import config from '../config.js'
import { deleteContainer } from './docker.js'
import logger from '../utils/logger.js'

async function disableSession(session: HydratedDocument<ISession>) {
  if (!session.containerId) {
    logger.warn(`Deleting session ${session._id} has no containerId`)
    return
  }
  try {
    await deleteContainer(session.containerId)
  } catch (err) {
    // Perform runtime check to safely access statusCode
    if (typeof err === 'object' && err !== null && 'statusCode' in err) {
      const error = err as { statusCode: number }
      if (error.statusCode !== 404) {
        throw new Error(
          `Failed to delete container ${session.containerId} for session ${session._id}`
        )
      }
    } else {
      // Handle the case where err is not the expected type
      logger.error(`An unexpected error occurred: ${err}`)
    }
  }
  if (session.status === 'active') {
    session.status = 'inactive'
  }
  session.containerId = null
  try {
    await session.save()
  } catch (err) {
    throw new Error(`Failed to save session ${session._id}\n${err}`)
  }
}

export async function removeExpired() {
  // Find all sessions that are containerId is not null and lastActivityAt is
  // less than the current time minus the expiry time
  try {
    const sessions = await Session.find({
      containerId: { $ne: null },
      lastActivityAt: { $lt: new Date(Date.now() - config.containerExpiry) },
    })
    await Promise.all(
      sessions.map((session) =>
        disableSession(session).catch((err) => {
          throw new Error(`Failed to expire session: ${session._id}\n${err}`)
        })
      )
    )
  } catch (err) {
    logger.error('Remove expiring failed:', err)
  }
}

export default function expiryRemovalScheduler() {
  schedule.scheduleJob('*/5 * * * *', removeExpired)
}
