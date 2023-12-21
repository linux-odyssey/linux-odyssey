import mongoose from 'mongoose'
import { Desc } from '../src/models/pagination.js'

describe('Pagination', () => {
  it('should return correct limit', async () => {
    const pagination = new Desc(10)

    expect(pagination.limit()).toMatchObject({ $limit: 10 })
  })

  it('should return correct order', async () => {
    const pagination = new Desc(10)

    expect(pagination.order('_id')).toMatchObject({ $sort: { _id: -1 } })
    expect(pagination.order('time')).toMatchObject({ $sort: { time: -1 } })
  })

  it('should return correct match stage for empty nextKey', async () => {
    const pagination = new Desc(10)

    expect(pagination.matchStage('_id')).toMatchObject({ $match: {} })
  })

  it('should return correct match stage for empty nextKey', async () => {
    const nextKeyStr = '656c7fea28a4c087bfcefe12'
    const pagination = new Desc(10, nextKeyStr)
    const nextKey = new mongoose.Types.ObjectId(nextKeyStr)

    expect(pagination.matchStage('_id')).toMatchObject({
      $match: {
        _id: {
          $lt: nextKey,
        },
      },
    })
  })
})
