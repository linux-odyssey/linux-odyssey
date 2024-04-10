import { Schema } from 'mongoose'
import { exceptionSchema, IException } from './exception.js'
import { requirementSchema, IRequirement } from './requirement.js'

export interface IGlobalException extends IException, IRequirement {}

export const globalExceptionSchema = new Schema<IGlobalException>({})

globalExceptionSchema.add(exceptionSchema)
globalExceptionSchema.add(requirementSchema)
