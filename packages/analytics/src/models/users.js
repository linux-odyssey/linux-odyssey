import { Session, User } from '@linux-odyssey/models'
import mongoose from 'mongoose'

function loginMethods(user) {
  const methods = []
  if (user.hashedPassword) methods.push('password')
  if (user.socialLogins) methods.push(...Object.keys(user.socialLogins))
  return methods
}

export function userCount() {
  return User.find().count()
}

export async function userList({ nextKey, itemsPerPage }) {
  const key = new mongoose.Types.ObjectId(nextKey)
  // const matchStage = nextKey ? { user: { $gt: key } } : {}
  const matchStage = nextKey ? { user: { $gt: key } } : {}
  const users = await Session.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: '$user',
        count: { $sum: 1 },
        lastActivityAt: { $max: '$lastActivityAt' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userData',
      },
    },
    { $unwind: '$userData' },
    { $sort: { 'userData._id': 1 } },
    { $limit: itemsPerPage },
  ])

  return users.map(({ userData, count, lastActivityAt }) => {
    const { _id, username, email, createdAt } = userData
    return {
      _id,
      username,
      email,
      createdAt: createdAt?.toLocaleString(),
      method: loginMethods(userData),
      sessionCount: count,
      lastActivityAt: lastActivityAt?.toLocaleString(),
    }
  })
}
