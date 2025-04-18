import { z } from 'zod'
import { fileConditionSchema } from './file-condition.js'
import { toArray } from '../utils.js'

const conditionSchemaBase = z.object({
  command: z.preprocess(toArray, z.array(z.string()).optional()),
  output: z.preprocess(toArray, z.array(z.string()).optional()),
  error: z.preprocess(toArray, z.array(z.string()).optional()),
  pwd: z.preprocess(toArray, z.array(z.string()).optional()),
  files: z.array(fileConditionSchema).optional(),
})

export type Condition = z.infer<typeof conditionSchemaBase> & {
  not?: Condition
  or?: Condition[]
}

export const conditionSchema = conditionSchemaBase.extend({
  not: z.lazy(() => conditionSchema).optional(),
  or: z.lazy(() => z.array(conditionSchema)).optional(),
}) as z.ZodType<Condition>
