import minimist from 'minimist'
import { FileGraph } from '@linux-odyssey/file-graph'
import Quest from '../models/quest.js'
import { pushToSession } from '../api/socket.js'

console.log(typeof FileGraph)

// 檢查 pattern 是否符合 input
const checkMatch = (pattern, input) => {
  if (pattern.length === 0) return true
  return pattern.some((p) => {
    const regex = new RegExp(p)
    return regex.test(input)
  })
}

async function discoverHandler(session, commandInput, additionalData) {
  const graph = new FileGraph(session.graph)
  graph.discover(additionalData.discover)
  console.log('graph:', graph.toString())
  session.graph = graph.toJSON()
  await session.save()
}

const pushGraph = (session, commandInput, additionalData) => {
  pushToSession(session.id, 'graph', {
    pwd: commandInput.pwd,
    discover: additionalData.discover,
  })
}

const eventListenr = {
  add: [],
  remove: [],
  discover: [discoverHandler, pushGraph],
  pwd: [],
}

function handleEvent(session, commandInput, additionalData) {
  const events = Object.keys(additionalData)
  events.forEach((event) => {
    const handlers = eventListenr[event]
    if (handlers) {
      handlers.forEach((handler) =>
        handler(session, commandInput, additionalData)
      )
    }
  })
}

async function commandHandler(session, commandInput, additionalData) {
  const quest = await Quest.findById(session.quest)
  const stage = quest.stages.find((s) => s.id === session.progress)
  if (!stage) {
    console.error('stage not found', session.progress)
    return {}
  }

  const argv = minimist(commandInput.command.split(' '))

  handleEvent(session, commandInput, additionalData)
  if (argv._[0] === 'cd') {
    pushToSession(session.id, 'graph', { pwd: commandInput.pwd })
  }

  const commandMatch = checkMatch(stage.condition.command, commandInput.command)
  const outputMatch = checkMatch(stage.condition.output, commandInput.output)
  const errorMatch = checkMatch(stage.condition.error, commandInput.output)

  if (!commandMatch || !outputMatch || !errorMatch) return {}

  session.completion.push(session.progress)
  session.hints.push(...stage.hints)

  session.progress = stage.next
  await session.save()

  if (stage.next === 'END') {
    session.status = 'finished'
    session.finishedAt = new Date()
    await session.save()
  }

  return {
    responses: stage.responses,
    hints: stage.hints,
    end: stage.next === 'END',
  }
}

export default commandHandler
