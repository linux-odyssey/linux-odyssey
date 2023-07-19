import { model } from 'mongoose'

export default model(
  'Quest',
  {
    name: String,
    description: String,
  },
  { timestamp: true }
)
