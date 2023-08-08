import Quest from '../models/quest.js'

// 檢查 pattern 是否符合 input
const checkMatch = (pattern, input) => {
  if (pattern.length === 0) return true
  return pattern.some((p) => {
    const regex = new RegExp(p)
    return regex.test(input)
  })
}

const commandHandler = async (session, commandInput) => {
  const quest = await Quest.findById(session.quest)
  const stage = quest.stages.find((s) => s.id === session.progress)
  if (!stage) {
    console.error('stage not found', session.progress)
    return {}
  }

  console.log(stage.condition)

  const commandMatch = checkMatch(stage.condition.command, commandInput.command)
  const outputMatch = checkMatch(stage.condition.output, commandInput.output)
  const errorMatch = checkMatch(stage.condition.error, commandInput.output)

  console.log(commandMatch, outputMatch, errorMatch)

  if (!commandMatch || !outputMatch || !errorMatch) return {}

  session.completion.push(session.progress)
  session.hints.push(...stage.hints)

  const nextStage = quest.stages.find((s) => s.id === stage.next)
  session.progress = nextStage.id
  await session.save()

  return {
    responses: stage.responses,
  }
}

export default commandHandler
