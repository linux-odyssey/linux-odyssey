import { Command } from '@linux-odyssey/models'
import mongoose from 'mongoose'

// eslint-disable-next-line import/prefer-default-export
export async function errorCommands({ nextKey, itemsPerPage }) {
  const key = new mongoose.Types.ObjectId(nextKey)
  const matchStage = nextKey ? { _id: { $lt: key } } : {}

  const commands = await Command.aggregate([
    {
      $match: matchStage,
    },
    {
      $match: {
        $and: [
          { error: { $exists: true } },
          { error: { $ne: null } },
          { error: { $ne: '' } },
        ],
      }
    }
    { $limit: itemsPerPage },
  ])
    .populate({
      path: 'session',
      populate: { path: 'user' },
    })
    .skip(skipAmount)
    .limit(itemsPerPage)
    .exec()
  return commands.map(({ command, error, createdAt, session }) => {
    const { user, quest } = session
    return {
      command: command.slice(0, 20),
      error: error.slice(0, 50),
      createdAt: createdAt?.toLocaleString(),
      user: user?.username,
      quest,
      session: session._id,
    }
  })
}
