/* eslint-disable max-classes-per-file */
export class TooManyRequestsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TooManyRequestsError'
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class LoadQuestError extends Error {
  constructor(message, questId) {
    super(message)
    this.name = 'LoadQuestError'
    this.questId = questId
  }
}

export class LoadSessionError extends Error {
  constructor(message, questId) {
    super(message)
    this.name = 'LoadSessionError'
    this.questId = questId
  }
}
