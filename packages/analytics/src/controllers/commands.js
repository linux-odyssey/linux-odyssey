/* eslint-disable object-shorthand */
import { Desc } from '../models/pagination.js'
import { errorCommands } from '../models/commands.js'

// eslint-disable-next-line import/prefer-default-export
export async function commandListController(req, res) {
  const { nextKey } = req.query
  const itemsPerPage = 100

  try {
    const payload = await errorCommands(new Desc(itemsPerPage, nextKey))
    const newNextKey = payload[payload.length - 1]?._id

    res.render('commands', { errorCommands: payload, nextKey: newNextKey })
  } catch (error) {
    res.status(500).send('Error fetching data')
  }
}
