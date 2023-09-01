import { pushToSession } from '../api/socket.js'

export default class SessionWrapper {
  constructor(session) {
    this.session = session
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

  execute(stage) {
    this.session.tasks
      .filter((t) => t.id === stage.id)
      .forEach((t) => {
        t.completed = true
      })
    this.session.hints.push(...stage.hints)
    if (stage.id === 'END') {
      this.session.status = 'finished'
      this.session.finishedAt = new Date()
    }
    const stages = this.getStages()
    console.debug(stages)
    const newTasks = stages
      .filter((s) => s.task)
      .map((s) => ({ id: s.id, name: s.task, completed: false }))

    this.session.tasks.push(...newTasks)
    pushToSession(this.session.id, 'tasks', this.session.tasks)
    return {
      responses: stage.responses,
      hints: stage.hints,
      tasks: newTasks,
    }
  }
}
