import { Session, User } from '@linux-odyssey/models'
import Pagination from './pagination.ts'

function loginMethods(user: any) {
  const methods = []
  if (user.hashedPassword) methods.push('password')
  if (user.socialLogins) methods.push(...Object.keys(user.socialLogins))
  return methods
}

export function userCount() {
  return User.countDocuments({})
}

export async function userList(pagination: Pagination) {
  const users = await Session.aggregate([
    pagination.match('user'),
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
    pagination.sort('userData._id'),
    pagination.limit(),
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
