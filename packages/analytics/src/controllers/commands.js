import { errorCommands } from '../models/commands.js'

// eslint-disable-next-line import/prefer-default-export
export async function commandListController(req, res) {
  const payload = {
    errorCommands: await errorCommands(),
  }
  res.render('commands', payload)
}
