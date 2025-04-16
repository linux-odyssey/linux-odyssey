import { z } from 'zod'

export const fileConditionSchema = z.object({
  path: z.string(),
  type: z.string().optional(),
  exists: z.boolean().default(true),
})

export type FileCondition = z.infer<typeof fileConditionSchema>
