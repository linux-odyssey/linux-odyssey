import { exec } from 'child_process'

import { buildFileCheckCmd } from '@linux-odyssey/utils'

// eslint-disable-next-line import/prefer-default-export
export function checkFiles(id, files) {
  return new Promise((resolve) => {
    const cmd = buildFileCheckCmd(files)
    // WARNING: This is not secure!
    exec(`docker exec ${id} ${cmd}`, (error, stdout, stderr) => {
      console.log('stdout', stdout)
      console.log('stderr', stderr)
      resolve(!error)
    })
  })
}
