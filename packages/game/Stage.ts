import { IStage } from './schema'
import { StageException } from './Exception'
import { Event } from './Event'

export class Stage extends Event {
  name: string
  private exceptions: StageException[]

  constructor({
    id,
    name,
    condition,
    requirements,
    exceptions,
    response,
  }: IStage) {
    super(id, condition, response, requirements)
    this.name = name || ''
    this.exceptions =
      exceptions?.map((exception) => new StageException(exception)) || []
  }

  getExceptions(): StageException[] {
    return this.exceptions
  }
}
