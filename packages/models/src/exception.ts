import { Schema } from 'mongoose'
import {
  commandResponderSchema,
  ICommandResponder,
} from './commandResponder.js'

export interface IException extends ICommandResponder {}

export const exceptionSchema = new Schema<IException>({})

exceptionSchema.add(commandResponderSchema)
