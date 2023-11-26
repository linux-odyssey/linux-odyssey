import { pushToSession } from '../api/socket.js'

export default class SessionHandler {
  constructor(session) {
    this.session = session
    this.quest = session.quest
  }

  getSession() {
    return this.session
  }

  getTask(stage) {
    return this.session.tasks.find((t) => t.id === stage.id)
  }

  isCompleted(stage) {
    const task = this.getTask(stage)
    return task ? task.completed : false
  }

  getUnlockedComponents(components) {
    return components.filter((component) =>
      component.requirements.every((r) => this.isCompleted({ id: r }))
    )
  }

  getStages() {
    const unlockedStages = this.getUnlockedComponents(this.quest.stages)
    return unlockedStages.filter((s) => !this.isCompleted(s))
  }

  getNewTasks() {
    const stages = this.getStages()
    return stages
      .filter((s) => s.task)
      .filter((s) => !this.session.tasks.some((t) => t.id === s.id))
      .map((s) => ({ id: s.id, name: s.task, completed: false }))
  }

  addNewTasks() {
    const newTasks = this.getNewTasks()
    this.session.tasks.push(...newTasks)
  }

  execute(stage) {
    this.session.tasks
      .filter((t) => t.id === stage.id)
      .forEach((t) => {
        t.completed = true
      })

    if (stage.hints && stage.hints.length > 0)
      this.session.hints.push(stage.hints)

    this.addNewTasks()

    return {
      responses: stage.responses,
      hints: stage.hints,
      callback: () => {
        pushToSession(this.session.id, 'tasks', this.session.tasks)
        if (stage.hints && stage.hints.length > 0)
          pushToSession(this.session.id, 'hints', stage.hints)
        pushToSession(this.session.id, 'status', this.session.status)
      },
    }
  }

  executeException(exception) {
    const { hints, responses } = exception
    if (hints && hints.length > 0) this.session.hints.push(hints)

    return {
      responses,
      hints,
      callback: () => {
        if (hints && hints.length > 0)
          pushToSession(this.session.id, 'hints', hints)
        pushToSession(this.session.id, 'status', this.session.status)
      },
    }
  }
}
