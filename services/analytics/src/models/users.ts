import { HydratedDocument, Types } from 'mongoose'
import { Session, User, IUser, ISession } from '../../../../packages/models'
import Pagination from './pagination'
import { UserSessionDetail } from '../interface'

function loginMethods(user: IUser): string[] {
  const methods: string[] = []
  if (user.hashedPassword) methods.push('password')
  if (user.socialLogins && typeof user.socialLogins === 'object') {
    methods.push(...Object.keys(user.socialLogins))
  }
  return methods
}

function formatTime(time: number) {
  const seconds = Math.floor(time / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`
}
export function userCount() {
  return User.countDocuments({})
}

export async function userList(pagination: Pagination) {
  const users: {
    userData: HydratedDocument<IUser>
    count: number
    lastActivityAt: Date
  }[] = await Session.aggregate([
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

export async function userDetail(
  id: Types.ObjectId
): Promise<UserSessionDetail[]> {
  const sessions: HydratedDocument<ISession>[] = await Session.find({
    user: id,
  })
  return sessions.map((session): UserSessionDetail => {
    const { _id, quest, status, createdAt, lastActivityAt } = session
    return {
      _id,
      quest,
      status,
      createdAt: createdAt?.toLocaleString(),
      usedTime:
        lastActivityAt && createdAt
          ? formatTime(lastActivityAt.getTime() - createdAt.getTime())
          : 'N/A', // Ensure both dates are present
    }
  })
}

export async function idToUser(id: Types.ObjectId): Promise<String> {
  const user = await User.findOne({
    _id: id,
  })
  return user?.username || 'User not found'
}
