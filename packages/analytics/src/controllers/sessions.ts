import Pagination from '../models/pagination.ts'
import { sessionList, sessionDetail } from '../models/sessions.ts'
import { Request, Response } from 'express'
export async function sessionListController(req: Request, res: Response) {
  const { nextKey, order } = req.query as { nextKey: string; order: string }
  const itemsPerPage = 50

  try {
    const pagination = new Pagination(order, itemsPerPage, nextKey)
    const sessions = await sessionList(pagination)
    const newNextKey = sessions[sessions.length - 1]?._id

    res.render('sessions', {
      sessions,
      nextKey: newNextKey,
      order: pagination.getOrder(),
    })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error fetching session data')
  }
}

export async function sessionDetailController(req: Request, res: Response) {
  const { id } = req.params
  const session = await sessionDetail(id)
  res.render('sessionDetail', { session })
}
