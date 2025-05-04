import { UserProfile } from '../../../../packages/models'

export interface QuestProgress {
  _id: string
  started: number
  completed: number
  completedRate: number
  failed: number
}

export function questList(): Promise<QuestProgress[]> {
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
                0,
              ],
            },
          },
        },
      },
    },
    {
      $sort: {
        completed: -1,
      },
    },
  ])
}
