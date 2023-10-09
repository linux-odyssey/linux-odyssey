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
