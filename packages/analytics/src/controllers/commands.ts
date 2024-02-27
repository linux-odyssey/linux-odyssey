/* eslint-disable object-shorthand */
import Pagination from '../models/pagination.ts'
import { errorCommands } from '../models/commands.js'

// eslint-disable-next-line import/prefer-default-export
export async function commandListController(req: any, res: any): Promise<void> {
  const { nextKey, order } = req.query as { nextKey?: string; order: string }
  const itemsPerPage = 100

  try {
    const pagination = new Pagination(order, itemsPerPage, nextKey)
    const payload = await errorCommands(pagination)
    const newNextKey = payload[payload.length - 1]?._id

    res.render('commands', {
      errorCommands: payload,
      nextKey: newNextKey,
      order: pagination.getOrder(),
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching data')
  }
}
