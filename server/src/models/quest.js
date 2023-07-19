import { model } from 'mongoose'
import { Schema } from 'yaml'

const Quest = model(
  'Quest',
  new Schema(
    {
      name: String,
      description: String,
    },
    { timestamp: true }
  )
)

export default Quest
