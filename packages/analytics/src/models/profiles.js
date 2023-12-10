/* eslint-disable object-shorthand */
/* eslint-disable func-names */
import { UserProfile } from '@linux-odyssey/models'

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

export function userProfileList() {
  return UserProfile.find()
}
