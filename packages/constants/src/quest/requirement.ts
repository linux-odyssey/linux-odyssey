import { z } from 'zod'

export const requirementSchema = z.array(z.string()).default([])

export type Requirement = z.infer<typeof requirementSchema>
