import Pagination from '../models/pagination.ts'
import { sessionList, sessionDetail } from '../models/sessions.ts'
import { Request, Response } from 'express'
export async function sessionListController(req: any, res: any) {
  const { nextKey, order } = req.query
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

export async function sessionDetailController(req: any, res: any) {
  const { id } = req.params
  const session = await sessionDetail(id)
  res.render('sessionDetail', { session })
}
