import { Session } from '@linux-odyssey/models'

export function sessionCount() {
  return Session.find().count()
}

export function sessionCompleted() {
  return Session.find({ status: 'finished' }).count()
}

export function averageTimeUsage() {
  return Session.aggregate([
    {
      $group: {
        _id: '$quest',
        average: {
          $avg: {
            $subtract: ['$finishedAt', '$createdAt'],
          },
        },
      },
    },
  ])
}

function formatTime(time) {
  const seconds = Math.floor(time / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`
}

export async function sessionList() {
  const sessions = await Session.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'commands',
        localField: '_id',
        foreignField: 'session',
        as: 'commands',
      },
    },
  ])
  console.log(sessions)
  return sessions.map(
    ({ user, quest, status, createdAt, finishedAt, commands }) => {
      return {
        user: user.username,
        quest,
        status,
        createdAt: createdAt?.toLocaleString(),
        finishedAt: finishedAt?.toLocaleString(),
        usedTime: finishedAt ? formatTime(finishedAt - createdAt) : '',
        commandCount: commands?.length,
      }
    }
  )
}
