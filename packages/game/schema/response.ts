import { z } from 'zod'

export const responseSchema = z.object({
  type: z.enum(['narrative', 'dialogue']).default('narrative'),
  content: z.string(),
  hint: z.string().optional(),
})

export type IResponse = z.infer<typeof responseSchema>
