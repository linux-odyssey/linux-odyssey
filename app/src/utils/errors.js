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

export default {
  TooManyRequestsError,
  ValidationError,
  UnauthorizedError,
}
