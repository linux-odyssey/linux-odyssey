/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
import mongoose, { Types } from 'mongoose'

export const DESC: string = 'desc'
export const ASC: string = 'asc'

interface Order {
  getOperator(): string
  getOrder(): number
  getName(): string
}

class Asc implements Order {
  getOperator(): string {
    return '$gt'
  }

  getOrder(): number {
    return 1
  }

  getName(): string {
    return ASC
  }
}

class Desc implements Order {
  getOperator(): string {
    return '$lt'
  }

  getOrder(): 1 | -1 {
    return -1
  }

  getName(): string {
    return DESC
  }
}

export default class Pagination {
  nextKey: Types.ObjectId | null = null
  itemsPerPage: number = 50
  order: Order

  constructor(
    order: string,
    itemsPerPage: number = 50,
    nextKey: string | null = null
  ) {
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

  match(field: string) {
    const stage: { [key: string]: { [key: string]: Types.ObjectId } } = this
      .nextKey
      ? {
          [field]: {
            [this.order ? this.order.getOperator() : '$gt']: this.nextKey,
          },
        }
      : {}
    return { $match: stage }
  }

  sort(field: string): { $sort: Record<string, 1 | -1> } {
    return { $sort: { [field]: this.order.getOrder() as 1 | -1 } }
  }

  limit() {
    return { $limit: this.itemsPerPage }
  }

  getOrder() {
    return this.order.getName()
  }
}
