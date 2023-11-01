import schedule from 'node-schedule'
import { Session } from '@linux-odyssey/models'
import config from '../config.js'
import { deleteContainer } from './docker.js'

export async function removeExpired() {
  // Find all sessions that are containerId is not null and lastActivityAt is
  // less than the current time minus the expiry time
  try {
    console.log('Checking for expired sessions')
    const sessions = await Session.find({
      containerId: { $ne: null },
      lastActivityAt: { $lt: new Date(Date.now() - config.containerExpiry) },
    })
    await Promise.all(
      sessions.map(async (session) => {
        console.log('Expiring session: ', session._id, session.containerId)
        try {
          await deleteContainer(session.containerId)
        } catch (err) {
          if (err.statusCode !== 404) {
            throw err
          }
        }
        if (session.status === 'active') {
          session.status = 'inactive'
        }
        session.containerId = null
        await session.save()
      })
    )
    console.log('Done checking for expired sessions')
  } catch (err) {
    console.error(err)
  }
}

export default function expiryRemovalScheduler() {
  schedule.scheduleJob('*/5 * * * *', removeExpired)
}
