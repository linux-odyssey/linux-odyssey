/* eslint-disable lines-between-class-members */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import mongoose from 'mongoose'

class Pagination {
  nextKey = null
  itemsPerPage = 50

  constructor(itemsPerPage = 50, nextKey = null) {
    this.itemsPerPage = itemsPerPage
    if (nextKey) {
      this.nextKey = new mongoose.Types.ObjectId(nextKey)
    }
  }

  limit() {
    return { $limit: this.itemsPerPage }
  }
}

export class Asc extends Pagination {
  matchStage(field) {
    const stage = this.nextKey ? { [field]: { $gt: this.nextKey } } : {}
    return { $match: stage }
  }

  order(field) {
    return { $sort: { [field]: 1 } }
  }
}

export class Desc extends Pagination {
  matchStage(field) {
    const stage = this.nextKey ? { [field]: { $lt: this.nextKey } } : {}
    return { $match: stage }
  }

  order(field) {
    return { $sort: { [field]: -1 } }
  }
}
