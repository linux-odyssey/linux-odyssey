import { z } from 'zod'
import { conditionSchema } from './condition.js'
import { responseSchema } from './response.js'

export const globalExceptionSchema = z.object({
  condition: conditionSchema,
  responses: z.array(responseSchema),
  requirements: z.array(z.string()),
})

export type GlobalException = z.infer<typeof globalExceptionSchema>
