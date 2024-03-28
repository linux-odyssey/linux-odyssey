/* eslint-disable max-classes-per-file */
export class TooManyRequestsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TooManyRequestsError'
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class LoadQuestError extends Error {
  questId: string
  constructor(message: string, questId: string) {
    super(message)
    this.name = 'LoadQuestError'
    this.questId = questId
  }
}

export class LoadSessionError extends Error {
  questId: string
  constructor(message: string, questId: string) {
    super(message)
    this.name = 'LoadSessionError'
    this.questId = questId
  }
}
