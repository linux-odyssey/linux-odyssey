import { z } from 'zod'
import { stageExceptionSchema } from './stage-exception.js'
import { conditionSchema } from './condition.js'
import { responseSchema } from './response.js'
import { hintSchema } from './hint.js'
import { requirementSchema } from './requirement.js'

export const stageSchema = z.object({
  id: z.string(),
  task: z.string(),
  exceptions: stageExceptionSchema.array().default([]),
  requirements: requirementSchema,
  condition: conditionSchema,
  responses: z.array(responseSchema),
  hints: hintSchema.default([]),
})

export type Stage = z.infer<typeof stageSchema>
