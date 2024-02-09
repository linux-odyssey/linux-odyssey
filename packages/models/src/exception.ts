import { Schema } from 'mongoose'
import commandResponderSchema from './commandResponder.js'

const exceptionSchema = new Schema({})

exceptionSchema.add(commandResponderSchema)

export default exceptionSchema
