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
    this.additionalData = additionalData
    this.eventListenr = {
      discover: [this.discoverHandler, this.pushGraph],
    }
  }

  handleEvent() {
    const events = Object.keys(this.additionalData)
    events.forEach((event) => {
      const handlers = this.eventListeners[event]
      if (handlers) {
        handlers.forEach((handler) => handler())
      }
    })
  }

  async discoverHandler() {
    const graph = new FileGraph(this.session.graph)
    graph.discover(this.additionalData.discover)
    console.log('graph:', graph.toString())
    this.session.graph = graph.toJSON()
    await this.session.save()
  }

  pushGraph() {
    pushToSession(this.session.id, 'graph', {
      pwd: this.commandInput.pwd,
      discover: this.additionalData.discover,
    })
  }

  async run() {
    const quest = await Quest.findById(this.session.quest)
    const stage = quest.stages.find((s) => s.id === this.session.progress)
    if (!stage) {
      console.error('stage not found', this.session.progress)
      return {}
    }

    const argv = minimist(this.commandInput.command.split(' '))

    this.handleEvent()
    if (argv._[0] === 'cd') {
      pushToSession(this.session.id, 'graph', { pwd: this.commandInput.pwd })
    }

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

    this.session.completion.push(this.session.progress)
    this.session.hints.push(...stage.hints)

    this.session.progress = stage.next
    await this.session.save()

    if (stage.next === 'END') {
      this.session.status = 'finished'
      this.session.finishedAt = new Date()
      await this.session.save()
    }

    return {
      responses: stage.responses,
      hints: stage.hints,
      end: stage.next === 'END',
    }
  }
}
