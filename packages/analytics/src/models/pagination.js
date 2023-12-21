/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import mongoose from 'mongoose'

export const DESC = 'desc'
export const ASC = 'asc'

class Asc {
  getOperator() {
    return '$gt'
  }

  getOrder() {
    return 1
  }

  getName() {
    return ASC
  }
}

class Desc {
  getOperator() {
    return '$lt'
  }

  getOrder() {
    return -1
  }

  getName() {
    return DESC
  }
}

export default class Pagination {
  nextKey = null
  itemsPerPage = 50
  order = null

  constructor(order, itemsPerPage = 50, nextKey = null) {
    this.itemsPerPage = itemsPerPage
    if (!order || order === DESC) {
      this.order = new Desc()
    } else if (order === ASC) {
      this.order = new Asc()
    } else {
      throw new Error('order must be asc or desc')
    }
    if (nextKey) {
      this.nextKey = new mongoose.Types.ObjectId(nextKey)
    }
  }

  match(field) {
    const stage = this.nextKey
      ? { [field]: { [this.order.getOperator()]: this.nextKey } }
      : {}
    return { $match: stage }
  }

  sort(field) {
    return { $sort: { [field]: this.order.getOrder() } }
  }

  limit() {
    return { $limit: this.itemsPerPage }
  }

  getOrder() {
    return this.order.getName()
  }
}
