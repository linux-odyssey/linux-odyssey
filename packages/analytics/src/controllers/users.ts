import Pagination from '../models/pagination.ts'
import { userList, userDetail, idToUser } from '../models/users.js'

export async function userListController(req: any, res: any) {
  const { nextKey, order } = req.query
  const itemsPerPage = 50

  try {
    const pagination = new Pagination(order, itemsPerPage, nextKey)
    const users = await userList(pagination)
    const newNextKey = users[users.length - 1]?._id

    res.render('users', {
      users,
      nextKey: newNextKey,
      order: pagination.getOrder(),
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching user data')
  }
}
export async function userDetailController(req: any, res: any) {
  const { id } = req.params
  const sessions = await userDetail(id)
  try {
    const user = await idToUser(id)
    res.render('usersDetail', { sessions, user })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching user data')
  }
}
