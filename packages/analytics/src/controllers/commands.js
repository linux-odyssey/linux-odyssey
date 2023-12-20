/* eslint-disable object-shorthand */
import { Command } from '@linux-odyssey/models'
import { errorCommands } from '../models/commands.js'

// eslint-disable-next-line import/prefer-default-export
export async function commandListController(req, res) {
  const { nextKey } = req.query
  const itemsPerPage = 250

  try {
    // const totalCommands = await Command.countDocuments({
    //   $and: [
    //     { error: { $exists: true } },
    //     { error: { $ne: null } },
    //     { error: { $ne: '' } },
    //   ],
    // })

    // const maxPages = Math.ceil(totalCommands / itemsPerPage)

    // const pageNumber = req.query

    const payload = await errorCommands({ nextKey, itemsPerPage })
    const newNextKey = payload[payload.length - 1]?._id

    res.render('commands', { payload, nextKey: newNextKey })
  } catch (error) {
    res.status(500).send('Error fetching data')
  }
}
