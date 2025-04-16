import { z } from 'zod'

export const responseSchema = z.object({
  type: z.enum(['narrative', 'dialogue']).default('narrative'),
  content: z.string(),
})

export type Response = z.infer<typeof responseSchema>
