import schedule from 'node-schedule'
import config from '../config.js'
import Session from '../models/session.js'
import { deleteContainer } from './docker.js'

export async function removeExpired() {
  // Find all sessions that are containerId is not null and lastActivityAt is
  // less than the current time minus the expiry time
  console.log('Checking for expired sessions')
  const sessions = await Session.find({
    containerId: { $ne: null },
    lastActivityAt: { $lt: new Date(Date.now() - config.expiry) },
  })
  await Promise.all(
    sessions.map(async (session) => {
      console.log('Expiring session: ', session._id, session.containerId)
      await deleteContainer(session.containerId)
      session.status = 'deactive'
      session.containerId = null
      await session.save()
    })
  )
  console.log('Done checking for expired sessions')
}

export default function expiryRemovalScheduler() {
  schedule.scheduleJob('*/5 * * * *', removeExpired)
}
