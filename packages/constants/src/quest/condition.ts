import { z } from 'zod'
import { fileConditionSchema } from './file-condition.js'

export const conditionSchema = z.object({
  command: z.array(z.string()).optional(),
  output: z.array(z.string()).optional(),
  error: z.array(z.string()).optional(),
  pwd: z.array(z.string()).optional(),
  files: z.array(fileConditionSchema).optional(),
})

export type Condition = z.infer<typeof conditionSchema>
