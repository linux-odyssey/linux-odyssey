import { z } from 'zod'
import { conditionSchema } from './condition.js'
import { responseSchema } from './response.js'
import { stageExceptionSchema } from './exception.js'

export const stageSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  name: z.string().optional(),
  requirements: z.array(z.string()),
  condition: conditionSchema,
  response: responseSchema,
  exceptions: stageExceptionSchema.array().optional(),
})

export type IStage = z.infer<typeof stageSchema>
