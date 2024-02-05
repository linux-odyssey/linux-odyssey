import { Schema } from 'mongoose'

const responseSchema = new Schema({
  type: {
    type: String,
    enum: ['narrative', 'dialogue'],
    default: 'dialogue',
    required: true,
  },
  content: {
    type: [String],
    required: true,
  },
  speaker: { type: String, default: 'Ada' },
  color: String,
})

export default responseSchema
