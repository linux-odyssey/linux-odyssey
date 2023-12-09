/* eslint-disable object-shorthand */
import { Command } from '@linux-odyssey/models'
import { errorCommands } from '../models/commands.js'

// eslint-disable-next-line import/prefer-default-export
export async function commandListController(req, res) {
  const itemsPerPage = 250

  try {
    const totalCommands = await Command.countDocuments({
      $and: [
        { error: { $exists: true } },
        { error: { $ne: null } },
        { error: { $ne: '' } },
      ],
    })

    const maxPages = Math.ceil(totalCommands / itemsPerPage)

    const pageNumber = req.query.page || 1
    const payload = {
      errorCommands: await errorCommands(pageNumber, itemsPerPage),
      pages: Array.from({ length: maxPages }, (_, index) => index + 1),
    }
    res.render('commands', payload)
  } catch (error) {
    res.status(500).send('Error fetching data')
  }
}
