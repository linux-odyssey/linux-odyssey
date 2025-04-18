import { z } from 'zod'
import { stageSchema } from './stage.js'
import { requirementsSchema } from './requirements.js'
// import { globalExceptionSchema } from './exception.js'
// import { requirementSchema } from './requirement.js'

export const questSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  instruction: z.string(),
  requirements: requirementsSchema,
  stages: z.array(stageSchema),
  // exceptions: z.array(globalExceptionSchema).default([]),
})

export type IQuest = z.infer<typeof questSchema>
