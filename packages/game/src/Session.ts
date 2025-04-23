import { FileGraph, INode } from '@linux-odyssey/file-graph'
import { Quest } from './Quest'
import {
  IQuest,
  ICommand,
  ISession,
  IFileExistenceChecker,
  IResponse,
  ITask,
} from './schema'

export class GameSession {
  private completed: string[] = []
  private quest: Quest
  private graph: FileGraph

  constructor(
    { completedEvents, graph }: ISession,
    quest: IQuest,
    checker: IFileExistenceChecker
  ) {
    this.completed = completedEvents
    this.quest = new Quest(quest, checker)
    this.graph = new FileGraph(graph)
  }

  get completedEvents() {
    return this.completed
  }

  complete(stageId: string) {
    this.completed.push(stageId)
  }

  getActiveStages(): string[] {
    return this.quest.getActiveStages(this.completed).map((stage) => stage.id)
  }

  async runCommand(command: ICommand) {
    const stageId = await this.quest.findSatisfiedEvent(command, this.completed)
    if (stageId) {
      this.complete(stageId)
    }
    return stageId
  }

  getResponses(): IResponse[] {
    return this.quest.getResponses(this.completed)
  }

  getTasks(): ITask[] {
    return this.quest.getTasks(this.completed)
  }

  getGraph(): INode {
    return this.graph
  }
}
