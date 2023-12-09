import { userList, userCount } from '../models/users.js'

export async function userListController(req, res) {
  const pageNumber = req.query.page || 1
  const itemsPerPage = 50

  try {
    const totalUsers = await userCount()
    const maxPages = Math.ceil(totalUsers / itemsPerPage)

    const users = await userList(pageNumber, itemsPerPage)

    res.render('users', {
      users,
      maxPages: Array.from({ length: maxPages }, (_, index) => index + 1),
    })
  } catch (error) {
    res.status(500).send('Error fetching user data')
  }
}
