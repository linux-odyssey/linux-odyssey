import Pagination from '../models/pagination.js'
import { sessionList, sessionDetail } from '../models/sessions.js'

export async function sessionListController(req, res) {
  const { nextKey, order } = req.query
  const itemsPerPage = 50

  try {
    // const totalSessions = await sessionCount()
    // const maxPages = Math.ceil(totalSessions / itemsPerPage)

    const sessions = await sessionList(
      new Pagination(order, itemsPerPage, nextKey)
    )
    const newNextKey = sessions[sessions.length - 1]?._id

    res.render('sessions', { sessions, nextKey: newNextKey })
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
