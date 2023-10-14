import { pushToSession } from '../api/socket.js'

export default class SessionHandler {
  constructor(session) {
    this.session = session
    this.quest = session.quest
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
    pushToSession(this.session.id, 'tasks', this.session.tasks)
  }

  execute(stage) {
    this.session.tasks
      .filter((t) => t.id === stage.id)
      .forEach((t) => {
        t.completed = true
      })

    this.session.hints.push(...stage.hints)
    pushToSession(this.session.id, 'hints', stage.hints)

    if (stage.id === 'END') {
      this.session.status = 'finished'
      this.session.finishedAt = new Date()
      pushToSession(this.session.id, 'status', 'finished')
    }

    this.addNewTasks()

    return {
      responses: stage.responses,
      hints: stage.hints,
    }
  }
}
