/* eslint-disable object-shorthand */
/* eslint-disable func-names */
import { UserProfile, Quest } from '@linux-odyssey/models'

export function totalQuests() {
  return UserProfile.aggregate([
    {
      $project: {
        _id: 0,
        progress: { $objectToArray: '$progress' },
      },
    },
    {
      $unwind: '$progress',
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
      },
    },
  ]).then((results) => {
    if (results.length === 0) {
      throw new Error('No documents found')
    }
    return results[0].totalCount
  })
}

export function totalCompleted() {
  return UserProfile.aggregate([
    {
      $project: {
        _id: 0,
        progress: { $objectToArray: '$progress' },
      },
    },
    {
      $unwind: '$progress',
    },
    {
      $match: {
        'progress.v.completed': true,
      },
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
      },
    },
  ]).then((results) => {
    if (results.length === 0) {
      throw new Error('No documents found')
    }
    return results[0].totalCount
  })
}

export function questList() {
  return UserProfile.aggregate([
    {
      $project: {
        progress: {
          $objectToArray: '$progress',
        },
      },
    },
    {
      $unwind: '$progress',
    },
    {
      $group: {
        _id: '$progress.v.quest',
        started: {
          $sum: 1,
        },
        completed: {
          $sum: {
            $cond: {
              if: { $eq: ['$progress.v.completed', true] },
              then: 1,
              else: 0,
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        started: 1,
        completed: 1,
        completedRate: {
          $cond: {
            if: { $eq: ['$started', 0] },
            then: 0,
            else: {
              $round: [
                { $multiply: [{ $divide: ['$completed', '$started'] }, 100] },
                2,
              ],
            },
          },
        },
      },
    },
    {
      $sort: {
        _id: 1, // 按任务ID升序排序
      },
    },
  ])
}
