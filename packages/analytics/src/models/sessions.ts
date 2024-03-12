import { Command, Session } from '../../../models/dist/index.js'
import Pagination from './pagination.js'
import {
  CommandObject,
  SessionDetail,
  SessionDocument,
  SessionObject,
} from '../interface.ts'

function formatTime(time: number) {
  const seconds = Math.floor(time / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`
}

export async function sessionList(
  pagination: Pagination
): Promise<SessionObject[]> {
  const sessions = await Session.aggregate([
    pagination.match('_id'),
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
    pagination.sort('_id'),
    pagination.limit(),
  ])

  return sessions.map((session) => {
    const {
      _id,
      user,
      quest,
      status,
      createdAt,
      finishedAt,
      commands,
      lastActivityAt,
    } = session
    return {
      _id,
      user: user.username, // Assuming `user` is always populated.
      quest,
      status,
      createdAt: createdAt?.toLocaleString(),
      finishedAt: finishedAt?.toLocaleString(),
      lastActivityAt: lastActivityAt?.toLocaleString(),
      usedTime:
        lastActivityAt && createdAt
          ? formatTime(lastActivityAt.getTime() - createdAt.getTime())
          : 'N/A', // Ensure both dates are present
      commandCount: commands?.length || 0,
      commands,
    }
  })
}

export async function sessionDetail(id: string): Promise<SessionDetail> {
  const session = (await Session.findById(id)
    .populate('user')
    .exec()) as unknown as SessionDocument
  const commands: CommandObject[] = (await Command.find({ session: id })).map(
    ({ command, pwd, output, error, createdAt, stage }): CommandObject => ({
      command: command?.slice(0, 20),
      pwd,
      stage,
      output: output?.slice(0, 50),
      error: error?.slice(0, 50),
      createdAt: createdAt?.toLocaleString(),
    })
  )
  const { _id, user, quest, status, createdAt, finishedAt } = session
  return {
    _id,
    user: user.username,
    quest,
    status,
    createdAt: createdAt?.toLocaleString(),
    finishedAt: finishedAt?.toLocaleString(),
    usedTime: finishedAt
      ? formatTime(finishedAt.getTime() - createdAt.getTime())
      : '',
    commands,
  }
}
