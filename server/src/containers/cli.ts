import { execFile } from 'child_process'

import { buildFileCheckCmd } from '../../../packages/utils'
import type { IFileExistenceChecker, IFileInput } from '../../../packages/game'

function sanitizeId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, '')
}

export class CLIFileExistenceChecker implements IFileExistenceChecker {
  constructor(private readonly containerId: string) {}
  exists(file: IFileInput) {
    return new Promise<boolean>((resolve) => {
      const cmd = buildFileCheckCmd(file)
      // WARNING: This is vulnerable to command injection
      execFile(
        'docker',
        ['exec', sanitizeId(this.containerId), ...cmd],
        { timeout: 1000 },
        (error) => {
          const exists = !error
          resolve(exists)
        }
      )
    })
  }
}
