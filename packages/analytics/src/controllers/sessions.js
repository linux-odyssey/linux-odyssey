import { sessionCount, sessionList, sessionDetail } from '../models/sessions.js'

export async function sessionListController(req, res) {
  const pageNumber = req.query.page || 1
  const itemsPerPage = 100

  try {
    const totalSessions = await sessionCount()
    const maxPages = Math.ceil(totalSessions / itemsPerPage)

    const sessions = await sessionList(pageNumber, itemsPerPage)

    const pages = Array.from({ length: maxPages }, (_, index) => index + 1)

    res.render('sessions', { sessions, pages })
  } catch (error) {
    res.status(500).send('Error fetching session data')
  }
}

export async function sessionDetailController(req, res) {
  const { id } = req.params
  const session = await sessionDetail(id)
  res.render('sessionDetail', { session })
}
