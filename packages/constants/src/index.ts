import { z } from 'zod'

export * from './quest/index.js'
export * from './session.js'

export const passwordPolicy = {
  minLength: 8,
  minNumbers: 1,
  minLowercase: 1,
  minUppercase: 1,
  minSymbols: 0,
}

export const getSessionsRequestSchema = z.object({
  questId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'finished']).optional(),
  limit: z.coerce.number().optional(),
  order: z.enum(['asc', 'desc']).optional(),
})

export type GetSessionsRequest = z.infer<typeof getSessionsRequestSchema>
