import { sessionList, sessionDetail } from '../models/sessions.js'

export async function sessionListController(req, res) {
  const sessions = await sessionList()
  res.render('sessions', { sessions })
}

export async function sessionDetailController(req, res) {
  const { id } = req.params
  const session = await sessionDetail(id)
  res.render('sessionDetail', { session })
}
