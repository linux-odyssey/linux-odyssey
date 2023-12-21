import { Desc } from '../constants.js'
import { userList, userCount } from '../models/users.js'

export async function userListController(req, res) {
  const { nextKey } = req.query
  const itemsPerPage = 50

  try {
    const users = await userList({
      nextKey,
      itemsPerPage,
      order: new Desc(),
    })
    const newNextKey = users[users.length - 1]?._id

    res.render('users', { users, nextKey: newNextKey })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching user data')
  }
}
