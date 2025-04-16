import { z } from 'zod'

export const questDetailResponseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  instruction: z.string(),
  requirements: z.array(z.string()),
})

export type QuestDetailResponse = z.infer<typeof questDetailResponseSchema>
