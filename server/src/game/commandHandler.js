import minimist from 'minimist'
import { FileGraph } from '@linux-odyssey/file-graph'
import Quest from '../models/quest.js'
import { pushToSession } from '../api/socket.js'

// 檢查 pattern 是否符合 input
const checkMatch = (pattern, input) => {
  if (pattern.length === 0) return true
  return pattern.some((p) => {
    const regex = new RegExp(p)
    return regex.test(input)
  })
}

export default class CommandHandler {
  constructor(session, commandInput, additionalData) {
    this.session = session
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

  getStages() {
    return this.quest.stages.filter((s) =>
      s.requirements.every((r) => this.session.completed.includes(r))
    )
  }

  matchStage(stage) {
    const commandMatch = checkMatch(
      stage.condition.command,
      this.commandInput.command
    )
    const outputMatch = checkMatch(
      stage.condition.output,
      this.commandInput.output
    )
    const errorMatch = checkMatch(
      stage.condition.error,
      this.commandInput.output
    )

    if (!commandMatch || !outputMatch || !errorMatch) return {}

    this.session.completed.push(stage.id)
    this.session.hints.push(...stage.hints)
    if (stage.id === 'END') {
      this.session.status = 'finished'
      this.session.finishedAt = new Date()
    }
    return {
      responses: stage.responses,
      hints: stage.hints,
    }
  }

  async run() {
    this.quest = await Quest.findById(this.session.quest)
    const stages = this.getStages()
    if (stages.length === 0) {
      console.error('stage not found', this.session.progress)
      return {}
    }

    console.log('stages', stages)

    this.handleEvent()
    this.handleCommand()

    const response = stages.reduce(
      (r, s) => ({ ...r, ...this.matchStage(s) }),
      {}
    )

    return {
      end: this.session.status === 'finished',
      ...response,
    }
  }
}
