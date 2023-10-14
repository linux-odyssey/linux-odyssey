import { Session, User } from '@linux-odyssey/models'

function loginMethods(user) {
  const methods = []
  if (user.hashedPassword) methods.push('password')
  if (user.google?.id) methods.push('google')
  if (user.github?.id) methods.push('github')
  return methods
}

export function userCount() {
  return User.find().count()
}

export async function userList() {
  const users = await Session.aggregate([
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
    { $sort: { 'userData.createdAt': 1 } },
  ])
  console.log(users)
  return users.map(({ userData, count, lastActivityAt }) => {
    const { username, email, createdAt } = userData
    return {
      username,
      email,
      createdAt: createdAt.toLocaleString(),
      method: loginMethods(userData),
      sessionCount: count,
      lastActivityAt: lastActivityAt.toLocaleString(),
    }
  })
}
