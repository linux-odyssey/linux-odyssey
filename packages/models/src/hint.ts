import { Schema } from 'mongoose'

export interface IHint {
  hints: string[]
}

export const hintSchema = new Schema({
  hints: {
    type: [String],
    required: true,
  },
})
