import { z } from 'zod'

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

export const SUPPORTED_LOCALES = ['zh-TW', 'en'] as const
export const LOCALE_NAME_MAP: Record<string, string> = {
  'zh-TW': '繁體中文',
  en: 'English',
}
export type QuestLocale = (typeof SUPPORTED_LOCALES)[number]
