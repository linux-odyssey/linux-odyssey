import { z } from 'zod'

export const hintSchema = z.array(z.string())

export type Hint = z.infer<typeof hintSchema>
