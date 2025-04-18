import { z } from 'zod'

export const responseSchema = z.object({
  type: z.enum(['narrative', 'dialogue']),
  content: z.string(),
})

export type IResponse = z.infer<typeof responseSchema>
