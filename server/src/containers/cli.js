import { execFile } from 'child_process'

import { buildFileCheckCmd } from '@linux-odyssey/utils'

function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '')
}

// eslint-disable-next-line import/prefer-default-export
export function checkFile(id, file) {
  return new Promise((resolve, reject) => {
    const cmd = buildFileCheckCmd(file)
    console.log(cmd)
    // WARNING: This is vulnerable to command injection
    execFile(
      'docker',
      ['exec', sanitizeId(id), ...cmd],
      { timeout: 1000 },
      (error, stdout, stderr) => {
        if (stderr) console.log('error', error)
        if (stdout) console.log('stdout', stdout)
        if (error) console.log('error', error)
        const exists = !error
        if (exists === file.exists) {
          resolve(true)
        } else {
          reject(new Error('File check failed'))
        }
      }
    )
  })
}
