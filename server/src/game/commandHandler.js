import minimist from 'minimist'
import { FileGraph } from '@linux-odyssey/file-graph'
import { Quest } from '@linux-odyssey/models'
import { pushToSession } from '../api/socket.js'
import SessionHandler from './sessionHandler.js'
import { checkFile } from '../containers/cli.js'

// 檢查 pattern 是否符合 input
const checkMatch = (pattern, input) => {
  if (!pattern || pattern.length === 0) return true
  return pattern.some((p) => {
    const regex = new RegExp(p)
    return regex.test(input)
  })
}

export default class CommandHandler extends SessionHandler {
  constructor(session, commandInput, params) {
    super(session)
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
    const graph = new FileGraph(this.session.graph)
    graph.discover(this.params.discover)
    this.session.graph = graph
  }

  async isMatch(condition) {
    return (
      this.checkKeys(condition) &&
      (await this.checkFiles(condition.files)) &&
      (await this.checkNot(condition.not)) &&
      (await this.checkOr(condition.or)) === true
    )
  }

  checkKeys(condition) {
    const keys = ['command', 'output', 'error', 'pwd']
    return keys.every((k) => checkMatch(condition[k], this.commandInput[k]))
  }

  async checkFiles(files) {
    if (files.length === 0) {
      return true
    }
    try {
      const checks = await Promise.all(
        files.map((f) => checkFile(this.session.containerId, f))
      )
      return checks.every((c) => c === true)
    } catch (e) {
      return false
    }
  }

  async checkNot(condition) {
    if (!condition) {
      return true
    }
    return !(await this.isMatch(condition))
  }

  async checkOr(conditions) {
    if (conditions.length === 0) {
      return true
    }
    const matches = await Promise.all(conditions.map((c) => this.isMatch(c)))
    return matches.some((m) => m === true)
  }

  async run() {
    this.quest = await Quest.findById(this.session.quest)
    const stages = this.getStages()
    if (stages.length === 0) {
      console.error('stage not found', this.session.tasks)
      return {}
    }

    this.handleEvent()
    this.handleCommand()

    const matches = await Promise.all(
      stages.map((stage) => this.isMatch(stage.condition))
    )

    const stage = stages.find((_, i) => matches[i])
    if (!stage) {
      return {}
    }
    const response = this.execute(stage)

    return {
      stage: stage.id,
      end: this.session.status === 'finished',
      ...response,
    }
  }
}
