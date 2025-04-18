import { z } from 'zod'

export const requirementsSchema = z.object({
  requirements: z.array(z.string()),
})

export type IRequirements = z.infer<typeof requirementsSchema>

export const responseSchema = z.object({
  type: z.enum(['narrative', 'dialogue']),
  content: z.string(),
})
