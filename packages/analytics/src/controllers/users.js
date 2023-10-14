import { userList } from '../models/users.js'

// eslint-disable-next-line import/prefer-default-export
export async function userListController(req, res) {
  res.render('users', { users: await userList() })
}
