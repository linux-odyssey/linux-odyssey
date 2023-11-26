import { Schema } from 'mongoose'
import exceptionSchema from './exception.js'
import requirementSchema from './requirement.js'

const globalExceptionSchema = new Schema({})

globalExceptionSchema.add(exceptionSchema)
globalExceptionSchema.add(requirementSchema)

export default globalExceptionSchema
