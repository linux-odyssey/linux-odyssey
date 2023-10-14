import { sessionList } from '../models/sessions.js'

// eslint-disable-next-line import/prefer-default-export
export async function sessionListController(req, res) {
  const sessions = await sessionList()
  res.render('sessions', { sessions })
}
