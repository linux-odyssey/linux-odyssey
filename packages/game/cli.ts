// eslint-disable-next-line import/no-extraneous-dependencies
import { zodToJsonSchema } from 'zod-to-json-schema'
import fs from 'fs'
import { questSchema } from './schema'

const jsonSchema = zodToJsonSchema(questSchema)

fs.writeFileSync('quest.json', JSON.stringify(jsonSchema, null, 2))
