import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Pagination from '../models/pagination.js'
import { userList, userDetail, idToUser } from '../models/users.js'

export async function userListController(req: Request, res: Response) {
  const { nextKey, order } = req.query as { nextKey: string; order: string }
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

export async function userDetailController(req: Request, res: Response) {
  const id = new mongoose.Types.ObjectId(req.params.id)
  const sessions = await userDetail(id)
  try {
    const user = await idToUser(id)
    res.render('usersDetail', { sessions, user })
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching user data')
  }
}
