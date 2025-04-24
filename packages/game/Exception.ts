/* eslint-disable max-classes-per-file */
import { Event } from './Event'
import { IStageException, IGlobalException } from './schema/exception'

export class StageException extends Event {
  readonly catchAll: boolean

  constructor({ id, condition, response, catchAll }: IStageException) {
    super(id, condition, response)
    this.catchAll = catchAll
  }
}

export class GlobalException extends Event {
  constructor({ id, condition, response, requirements }: IGlobalException) {
    super(id, condition, response, requirements)
  }
}
