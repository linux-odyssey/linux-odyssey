import { Command } from '@linux-odyssey/models'

// eslint-disable-next-line import/prefer-default-export
export async function errorCommands() {
  const commands = await Command.find({ error: { $ne: '' } })
    .populate({
      path: 'session',
      populate: [
        {
          path: 'user',
        },
        { path: 'quest' },
      ],
    })
    .exec()
  return commands.map(({ command, error, createdAt, session }) => {
    const { user, quest } = session
    return {
      command,
      error,
      createdAt: createdAt.toLocaleString(),
      user: user.username,
      quest: quest.id,
    }
  })
}
