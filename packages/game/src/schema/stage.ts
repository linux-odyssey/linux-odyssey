import { z } from 'zod'
import { conditionSchema, responseSchema } from './index.js'

export const stageSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  name: z.string().optional(),
  requirements: z.array(z.string()),
  condition: conditionSchema,
  response: responseSchema,
})

export type IStage = z.infer<typeof stageSchema>
