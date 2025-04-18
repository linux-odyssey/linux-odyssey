import { z } from 'zod'

export const requirementsSchema = z.array(z.string())

export type IRequirements = z.infer<typeof requirementsSchema>
