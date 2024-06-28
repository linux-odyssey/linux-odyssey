import minimist from 'minimist'
import { HydratedDocument } from 'mongoose'
import { FileGraph } from '@linux-odyssey/file-graph'
import {
  ICommand,
  ICondition,
  IFileCondition,
  IQuest,
  ISession,
  IStage,
  IException,
} from '@linux-odyssey/models'
import { pushToSession } from '../api/socket.js'
import SessionHandler, { ExecuteResult } from './sessionHandler.js'
import { checkFile } from '../containers/cli.js'
import logger from '../utils/logger.js'

// 檢查 pattern 是否符合 input
const checkMatch = (pattern?: string[], input?: string) => {
  if (!pattern || pattern.length === 0) return true
  return pattern.some((p) => {
    const regex = new RegExp(p)
    return input && regex.test(input)
  })
}

export default class CommandHandler extends SessionHandler {
  commandInput: ICommand
  argv: minimist.ParsedArgs
  params: Record<string, any>

  constructor(
    session: HydratedDocument<ISession>,
    quest: HydratedDocument<IQuest>,
    commandInput: ICommand,
    params: Record<string, any>
  ) {
    super(session, quest)
    this.commandInput = commandInput
    this.argv = minimist(this.commandInput.command.split(' '))

    this.params = params
  }

  handleEvent() {
    if (this.params.discover) this.discoverHandler()
  }

  handleCommand() {
    const command = this.argv._[0]
    switch (command) {
      case 'cd':
        pushToSession(this.session.id, 'graph', {
          pwd: this.commandInput.pwd,
        })
        break

      case 'ls':
        pushToSession(this.session.id, 'graph', {
          pwd: this.commandInput.pwd,
          discover: this.params.discover,
        })
        break

      default:
        break
    }
  }

  async discoverHandler() {
    try {
      const graph = new FileGraph(this.session.graph)
      graph.discover(this.params.discover)
      this.session.graph = graph
    } catch (e) {
      logger.error('Update file graph failed', {
        error: (e as Error).message,
        session: this.session.id,
        graph: this.session.graph,
        discover: this.params.discover,
      })
    }
  }

  async isMatch(condition: ICondition): Promise<boolean> {
    return (
      this.checkKeys(condition) &&
      (await this.checkFiles(condition.files)) &&
      (await this.checkNot(condition.not)) &&
      (await this.checkOr(condition.or)) === true
    )
  }

  checkKeys(condition: ICondition) {
    return (
      checkMatch(condition.command, this.commandInput.command) &&
      checkMatch(condition.output, this.commandInput.output) &&
      checkMatch(condition.error, this.commandInput.error) &&
      checkMatch(condition.pwd, this.commandInput.pwd)
    )
  }

  async checkFiles(files?: IFileCondition[]): Promise<boolean> {
    if (!files || files.length === 0) {
      return true
    }
    try {
      const checks = await Promise.all(
        files.map(
          (f) =>
            this.session.containerId && checkFile(this.session.containerId, f)
        )
      )
      return checks.every((c) => c === true)
    } catch {
      return false
    }
  }

  async checkNot(condition?: ICondition): Promise<boolean> {
    if (!condition) {
      return true
    }
    return !(await this.isMatch(condition))
  }

  async checkOr(conditions?: ICondition[]): Promise<boolean> {
    if (!conditions || conditions.length === 0) {
      return true
    }
    const matches = await Promise.all(conditions.map((c) => this.isMatch(c)))
    return matches.some((m) => m === true)
  }

  async checkException(stage: IStage): Promise<IException | null> {
    const exceptions = stage.exceptions || []
    for (const exception of exceptions) {
      // eslint-disable-next-line no-await-in-loop
      if (exception.condition && (await this.isMatch(exception.condition))) {
        return exception
      }
      if (exception.catchAll) return exception
    }
    return null
  }

  async run(): Promise<ExecuteResult | null> {
    try {
      const stages = this.getStages()
      if (stages.length === 0) {
        logger.warn('stage not found', { session: this.session.id })
        return null
      }

      this.handleEvent()
      this.handleCommand()

      const matches = await Promise.all(
        stages.map((stage) => stage.condition && this.isMatch(stage.condition))
      )

      const stage = stages.find((_, i) => matches[i])
      if (stage) {
        const response = this.execute(stage)

        return {
          stage: stage.id,
          end: this.session.status === 'finished',
          ...response,
        }
      }

      // stage exception
      for (const s of stages) {
        // eslint-disable-next-line no-await-in-loop
        const exception = await this.checkException(s)
        if (exception) {
          return this.executeException(exception)
        }
      }

      // global exception
      if (this.quest.exceptions.length > 0) {
        const globalExceptions = this.getUnlockedComponents(
          this.quest.exceptions
        )
        for (const exception of globalExceptions) {
          if (
            exception.condition &&
            // eslint-disable-next-line no-await-in-loop
            (await this.isMatch(exception.condition))
          ) {
            return this.executeException(exception)
          }
        }
      }

      return null
    } catch (err) {
      logger.error('CommandHandler error', {
        error: (err as Error).message,
        session: this.session._id,
        quest: this.quest._id,
        command: this.commandInput,
      })
      return null
    }
  }
}
