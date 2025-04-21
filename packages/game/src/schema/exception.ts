import { z } from 'zod'
import { conditionSchema } from './condition.js'
import { responseSchema } from './response.js'
import { requirementsSchema } from './requirements.js'

export const exceptionSchema = z.object({
  id: z.string(),
  condition: conditionSchema,
  response: responseSchema,
})

export type Exception = z.infer<typeof exceptionSchema>

export const stageExceptionSchema = exceptionSchema.extend({
  catchAll: z.boolean().default(false),
})

export type StageException = z.infer<typeof stageExceptionSchema>

export const globalExceptionSchema = exceptionSchema.extend({
  requirements: requirementsSchema.default([]),
})

export type GlobalException = z.infer<typeof globalExceptionSchema>
