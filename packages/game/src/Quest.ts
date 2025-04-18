import { IQuest, IStage } from './schema'
import { Stage } from './Stage'

export class Quest {
  private stages: Stage[]
  private quest: IQuest

  constructor(quest: IQuest) {
    this.quest = quest
    this.stages = quest.stages.map((stage: IStage) => new Stage(stage))
  }

  getActiveStages(completed: string[]) {
    return this.stages.filter((stage) => stage.active(completed))
  }
}
