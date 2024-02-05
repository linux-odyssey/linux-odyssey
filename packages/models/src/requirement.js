import { Schema } from 'mongoose'

const requirementSchema = new Schema({
  requirements: [
    {
      type: String,
      required: true,
    },
  ],
})

export default requirementSchema
