import { Schema } from 'mongoose'

const hintSchema = new Schema({
  hints: {
    type: [String],
    required: true,
  },
})

export default hintSchema
