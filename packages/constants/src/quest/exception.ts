import { z } from 'zod'
import { conditionSchema } from './condition.js'
import { responseSchema } from './response.js'

export const exceptionSchema = z.object({
  condition: conditionSchema,
  responses: z.array(responseSchema),
})

export type Exception = z.infer<typeof exceptionSchema>

export const stageExceptionSchema = exceptionSchema.extend({
  catchAll: z.boolean().default(false),
})

export type StageException = z.infer<typeof stageExceptionSchema>

export const globalExceptionSchema = exceptionSchema.extend({
  requirements: z.array(z.string()),
})

export type GlobalException = z.infer<typeof globalExceptionSchema>
