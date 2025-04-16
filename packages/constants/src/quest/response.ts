import { z } from 'zod'
import { toArray } from '../utils.js'

export const responseSchema = z.object({
  type: z.enum(['narrative', 'dialogue']).default('narrative'),
  content: z.preprocess(toArray, z.array(z.string())),
})

export type Response = z.infer<typeof responseSchema>
