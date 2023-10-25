import minimist from 'minimist'
import { FileGraph } from '@linux-odyssey/file-graph'
import { Quest } from '@linux-odyssey/models'
import { pushToSession } from '../api/socket.js'
import SessionHandler from './sessionHandler.js'
import { checkFiles } from '../containers/docker.js'

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

  async isMatch(condition) {
    const keys = ['command', 'output', 'error', 'pwd']
    if (keys.some((k) => !checkMatch(condition[k], this.commandInput[k]))) {
      return false
    }
    if (condition.files.length > 0) {
      const match = await this.checkFiles(condition.files)
      if (!match) return false
    }
    if (condition.$not) {
      const match = await this.isMatch(condition.$not)
      if (match) return false
    }
    if (condition.$or.length > 0) {
      const matches = await Promise.all(
        condition.$or.map((c) => this.isMatch(c))
      )
      if (matches.every((m) => m === false)) return false
    }
    return true
  }

  checkFiles(files) {
    console.log('checkFiles', files)
    return checkFiles(this.session.containerId, files)
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

    console.log('matches', matches)

    const filteredStages = stages.filter((_, i) => matches[i])
    console.log('filteredStages', filteredStages)
    const response = filteredStages.reduce(
      (r, s) => ({ ...r, ...this.execute(s) }),
      {}
    )

    return {
      end: this.session.status === 'finished',
      ...response,
    }
  }
}
