import { z } from 'zod'

export const fileInputSchema = z.object({
  path: z.string(),
  type: z.enum(['file', 'folder']),
})

export type IFileInput = z.infer<typeof fileInputSchema>

export const fileExistenceInputSchema = fileInputSchema.extend({
  exists: z.boolean(),
})

export type IFileExistenceInput = z.infer<typeof fileExistenceInputSchema>

const baseConditionSchema = z.object({
  command: z.string().optional(),
  output: z.string().optional(),
  error: z.string().optional(),
  pwd: z.string().optional(),
  files: z.array(fileExistenceInputSchema).optional(),
})

export type ICondition = z.infer<typeof baseConditionSchema> & {
  or?: ICondition[]
  not?: ICondition
}

export const conditionSchema: z.ZodType<ICondition> =
  baseConditionSchema.extend({
    or: z.lazy(() => z.array(conditionSchema).optional()),
    not: z.lazy(() => conditionSchema.optional()),
  })

export interface IFileExistenceChecker {
  exists(file: IFileInput): Promise<boolean>
}
