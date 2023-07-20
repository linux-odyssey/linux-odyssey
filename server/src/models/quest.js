import { model, Schema } from 'mongoose'

const Quest = model(
  'Quest',
  new Schema({
    name: String,
    title: String,
    order: Number,
    content: String,
  })
)

export default Quest
