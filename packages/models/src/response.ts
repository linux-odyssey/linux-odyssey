import { Schema } from 'mongoose'

export interface IResponse {
  type: 'narrative' | 'dialogue'
  content: string[]
  speaker?: string
  color?: string
}

export const responseSchema = new Schema<IResponse>({
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
