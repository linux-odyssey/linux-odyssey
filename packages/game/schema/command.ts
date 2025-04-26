import { z } from 'zod'

const fileSchema = z.object({
  path: z.string(),
  type: z.enum(['file', 'directory']),
  discovered: z.boolean(),
})

export const commandParamsSchema = z.object({
  discover: fileSchema.array().optional(),
  pwd: z.string().optional(),
})

export type ICommandParams = z.infer<typeof commandParamsSchema>

export const commandSchema = z.object({
  command: z.string().optional(),
  output: z.string().optional(),
  error: z.string().optional(),
  pwd: z.string().optional(),
  params: commandParamsSchema.optional(),
})

export type ICommand = z.infer<typeof commandSchema>
