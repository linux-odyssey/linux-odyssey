import { Schema } from 'mongoose'

export interface IRequirement {
  requirements: string[]
}

export const requirementSchema = new Schema<IRequirement>({
  requirements: [
    {
      type: String,
      required: true,
    },
  ],
})
