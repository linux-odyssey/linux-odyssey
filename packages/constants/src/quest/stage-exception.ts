import { z } from 'zod'
import { conditionSchema } from './condition.js'
import { responseSchema } from './response.js'

export const stageExceptionSchema = z.object({
  condition: conditionSchema,
  responses: z.array(responseSchema),
})

export type StageException = z.infer<typeof stageExceptionSchema>
