import { Command, Session } from '@linux-odyssey/models'
import mongoose from 'mongoose'

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

function formatTime(time) {
  const seconds = Math.floor(time / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`
}

export async function sessionList({ nextKey, itemsPerPage }) {
  const key = new mongoose.Types.ObjectId(nextKey)
  const matchStage = nextKey ? { _id: { $lt: key } } : {}

  const sessions = await Session.aggregate([
    {
      $match: matchStage,
    },
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
    { $sort: { _id: -1 } },
    { $limit: itemsPerPage },
  ])

  return sessions.map(
    ({
      _id,
      user,
      quest,
      status,
      createdAt,
      finishedAt,
      commands,
      lastActivityAt,
    }) => {
      return {
        _id,
        user: user.username,
        quest,
        status,
        createdAt: createdAt?.toLocaleString(),
        finishedAt: finishedAt?.toLocaleString(),
        lastActivityAt: lastActivityAt?.toLocaleString(),
        usedTime: formatTime(lastActivityAt - createdAt),
        commandCount: commands?.length,
      }
    }
  )
}

export async function sessionDetail(id) {
  const session = await Session.findById(id).populate('user').exec()
  const commands = (await Command.find({ session: id })).map(
    ({ command, pwd, output, error, createdAt, stage }) => ({
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
    usedTime: finishedAt ? formatTime(finishedAt - createdAt) : '',
    commands,
  }
}
