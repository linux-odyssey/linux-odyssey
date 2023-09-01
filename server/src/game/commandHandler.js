import minimist from 'minimist'
import { FileGraph } from '@linux-odyssey/file-graph'
import Quest from '../models/quest.js'
import { pushToSession } from '../api/socket.js'
import SessionHandler from './sessionHandler.js'

// 檢查 pattern 是否符合 input
const checkMatch = (pattern, input) => {
  if (!pattern || pattern.length === 0) return true
  return pattern.some((p) => {
    const regex = new RegExp(p)
    return regex.test(input)
  })
}

export default class CommandHandler extends SessionHandler {
  constructor(session, commandInput, additionalData) {
    super(session)
    this.commandInput = commandInput
    this.argv = minimist(this.commandInput.command.split(' '))

    this.additionalData = additionalData
  }

  handleEvent() {
    if (this.additionalData.discover) this.discoverHandler()
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
          discover: this.additionalData.discover,
        })
        break

      default:
        break
    }
  }

  async discoverHandler() {
    const graph = new FileGraph(this.session.graph)
    graph.discover(this.additionalData.discover)
    this.session.graph = graph
  }

  isMatch(stage) {
    const keys = ['command', 'output', 'error', 'pwd']
    return keys.every((k) =>
      checkMatch(stage.condition[k], this.commandInput[k])
    )
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

    const response = stages
      .filter((s) => this.isMatch(s))
      .reduce((r, s) => ({ ...r, ...this.execute(s) }), {})

    console.log(this.session)
    return {
      end: this.session.status === 'finished',
      ...response,
    }
  }
}
