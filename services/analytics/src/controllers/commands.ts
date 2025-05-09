import type { Request, Response } from 'express'
import Pagination from '../models/pagination'
import { errorCommands } from '../models/commands'

export async function commandListController(
  req: Request,
  res: Response
): Promise<void> {
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
