import { model, Schema } from 'mongoose'

const Quest = model(
  'Quest',
  new Schema({
    _id: String,
    title: String,
    order: Number,
    content: String,
  })
)

export default Quest
