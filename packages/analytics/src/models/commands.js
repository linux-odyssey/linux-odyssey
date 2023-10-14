import { Command } from '@linux-odyssey/models'

// eslint-disable-next-line import/prefer-default-export
export async function errorCommands() {
  const commands = await Command.find({
    $and: [
      { error: { $exists: true } },
      { error: { $ne: null } },
      { error: { $ne: '' } },
    ],
  })
    .populate({
      path: 'session',
      populate: { path: 'user' },
    })
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
