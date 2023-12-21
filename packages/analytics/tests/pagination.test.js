import mongoose from 'mongoose'
import Pagination, { ASC, DESC } from '../src/models/pagination.js'

describe('Pagination', () => {
  it('should failed when not provide order', () => {
    expect(() => new Pagination()).toThrow('order must be asc or desc')
  })
  it('should return correct limit', () => {
    const pagination = new Pagination(DESC, 10)

    expect(pagination.limit()).toMatchObject({ $limit: 10 })
  })

  it('desc should return correct order', async () => {
    const pagination = new Pagination(DESC, 10)

    expect(pagination.sort('_id')).toMatchObject({ $sort: { _id: -1 } })
    expect(pagination.sort('time')).toMatchObject({ $sort: { time: -1 } })
  })

  it('asc should return correct order', async () => {
    const pagination = new Pagination(ASC, 10)

    expect(pagination.sort('_id')).toMatchObject({ $sort: { _id: 1 } })
    expect(pagination.sort('time')).toMatchObject({ $sort: { time: 1 } })
  })

  it('should return correct match stage for empty nextKey', async () => {
    const pagination = new Pagination(DESC, 10)

    expect(pagination.match('_id')).toMatchObject({ $match: {} })
  })

  it('should return correct match stage for empty nextKey', async () => {
    const nextKeyStr = '656c7fea28a4c087bfcefe12'
    const pagination = new Pagination(DESC, 10, nextKeyStr)
    const nextKey = new mongoose.Types.ObjectId(nextKeyStr)

    expect(pagination.match('_id')).toMatchObject({
      $match: {
        _id: {
          $lt: nextKey,
        },
      },
    })
  })
})
