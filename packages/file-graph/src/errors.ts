/* eslint-disable max-classes-per-file */
export class DuplicateItemError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DuplicateItemError'
  }
}

export class ParentNotExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParentNotExistsError'
  }
}

export class FileNotExistsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileNotExistsError'
  }
}
