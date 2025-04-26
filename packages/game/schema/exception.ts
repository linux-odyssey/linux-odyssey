import { z } from 'zod'
import { conditionSchema } from './condition.js'
import { responseSchema } from './response.js'
import { requirementsSchema } from './requirements.js'

export const exceptionSchema = z.object({
  id: z.string(),
  condition: conditionSchema,
  response: responseSchema,
})

export type IException = z.infer<typeof exceptionSchema>

export const stageExceptionSchema = exceptionSchema.extend({
  catchAll: z.boolean().default(false),
})

export type IStageException = z.infer<typeof stageExceptionSchema>

export const globalExceptionSchema = exceptionSchema.extend({
  requirements: requirementsSchema.default([]),
})

export type IGlobalException = z.infer<typeof globalExceptionSchema>
