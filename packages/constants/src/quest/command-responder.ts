import { z } from 'zod'
import { conditionSchema } from './condition.js'
import { responseSchema } from './response.js'

export const commandResponderSchema = z.object({
  condition: conditionSchema.optional(),
  responses: z.array(responseSchema),
  hints: z.array(z.string()),
})

export type CommandResponder = z.infer<typeof commandResponderSchema>
