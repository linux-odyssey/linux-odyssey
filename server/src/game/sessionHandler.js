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

  getStages() {
    return this.quest.stages.filter(
      (stage) =>
        stage.requirements.every((r) => this.isCompleted({ id: r })) &&
        (stage.repeatable || !this.isCompleted(stage))
    )
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

    this.session.hints.push(stage.hints)

    this.addNewTasks()

    return {
      responses: stage.responses,
      hints: stage.hints,
      callback: () => {
        pushToSession(this.session.id, 'tasks', this.session.tasks)
        pushToSession(this.session.id, 'hints', stage.hints)
        pushToSession(this.session.id, 'status', this.session.status)
      },
    }
  }
}
