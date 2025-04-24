import { z } from 'zod'
import { conditionSchema } from './condition.js'
import { responseSchema } from './response.js'
import { stageExceptionSchema } from './exception.js'
import { requirementsSchema } from './requirements.js'

export const stageSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  name: z.string().optional(),
  requirements: requirementsSchema.default([]),
  condition: conditionSchema,
  response: responseSchema,
  exceptions: stageExceptionSchema.array().optional(),
})

export type IStage = z.infer<typeof stageSchema>
