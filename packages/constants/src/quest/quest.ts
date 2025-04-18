import { z } from 'zod'
import { stageSchema } from './stage.js'
import { globalExceptionSchema } from './exception.js'
import { requirementSchema } from './requirement.js'

export const questSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  instruction: z.string(),
  requirements: requirementSchema,
  stages: z.array(stageSchema),
  exceptions: z.array(globalExceptionSchema).default([]),
})

export type Quest = z.infer<typeof questSchema>
