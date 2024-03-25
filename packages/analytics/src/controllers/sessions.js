import Pagination from '../models/pagination.js'
import { sessionList, sessionDetail } from '../models/sessions.js'

export async function sessionListController(req, res) {
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

export async function sessionDetailController(req, res) {
  const { id } = req.params
  const session = await sessionDetail(id)
  res.render('sessionDetail', { session })
}
