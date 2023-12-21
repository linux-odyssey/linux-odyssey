import mongoose from 'mongoose'
import { Session, User } from '@linux-odyssey/models'

function loginMethods(user) {
  const methods = []
  if (user.hashedPassword) methods.push('password')
  if (user.socialLogins) methods.push(...Object.keys(user.socialLogins))
  return methods
}

export function userCount() {
  return User.find().count()
}

export async function userList({ nextKey, itemsPerPage, order }) {
  let matchStage = {}
  if (nextKey) {
    const key = new mongoose.Types.ObjectId(nextKey)
    matchStage = { user: order.matchStage(key) }
  }
  console.log(matchStage)
  const users = await Session.aggregate([
    { $match: matchStage },
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
    { $sort: { 'userData._id': order.order() } },
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
