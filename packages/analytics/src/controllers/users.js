import { Desc } from '../models/pagination.js'
import { userList } from '../models/users.js'

export async function userListController(req, res) {
  const { nextKey } = req.query
  const itemsPerPage = 50

  try {
    const users = await userList(new Desc(itemsPerPage, nextKey))
    const newNextKey = users[users.length - 1]?._id

    res.render('users', { users, nextKey: newNextKey })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching user data')
  }
}
