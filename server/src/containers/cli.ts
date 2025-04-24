import { execFile } from 'child_process'

import { buildFileCheckCmd } from '../../../packages/utils'
import type { IFileExistenceChecker, IFileInput } from '../../../packages/game'

function sanitizeId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, '')
}

// eslint-disable-next-line import/prefer-default-export
export function checkFile(id: string, file: IFileInput) {
  return new Promise<boolean>((resolve) => {
    const cmd = buildFileCheckCmd(file)
    // WARNING: This is vulnerable to command injection
    execFile(
      'docker',
      ['exec', sanitizeId(id), ...cmd],
      { timeout: 1000 },
      (error) => {
        const exists = !error
        resolve(exists)
      }
    )
  })
}

export class CLIFileExistenceChecker implements IFileExistenceChecker {
  // eslint-disable-next-line class-methods-use-this
  async exists(file: IFileInput) {
    return checkFile(file.path, file)
  }
}
