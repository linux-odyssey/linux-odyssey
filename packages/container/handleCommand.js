const fs = require('fs').promises
const minimist = require('minimist')
const { discoverFiles, collectFilesInfo } = require('./discover')
const { resolvePath } = require('./utils')

const commandListeners = {
  ls: {
    opts: {
      boolean: ['a', 'l', 'h'],
    },
    handler: discoverFiles,
  },
  cd: {
    handler: changeDirectory,
  },
  touch: {
    handler: createFiles,
  },
  mkdir: {
    opts: {
      boolean: ['p'],
    },
    handler: createFiles,
  },
  cp: {
    opts: {
      boolean: ['r'],
    },
    handler: copyFiles,
  },
  rm: {
    opts: {
      boolean: ['r'],
    },
    handler: removeFiles,
  },
  rmdir: {
    opts: {
      boolean: ['p', 'v'],
    },
    handler: removeFiles,
  },
}

async function handleCommand(command) {
  const name = command.split(' ')[0]
  const listener = commandListeners[name]
  if (!listener) return {}
  const argv = minimist(command.split(' '), listener.opts)
  return listener.handler(argv)
}

function changeDirectory() {
  return {
    pwd: process.cwd(),
  }
}

async function createFiles(argv) {
  const { _ } = argv
  const files = _.slice(1)
  const results = []
  for (const file of files) {
    const filePath = resolvePath(file)
    try {
      const exists = await fs.stat(filePath)
      if (exists) {
        results.push({
          path: filePath,
          type: exists.isFile() ? 'file' : 'directory',
          discovered: true,
        })
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err
      }
    }
  }
  return {
    add: results,
  }
}

async function copyFiles(argv) {
  const { _ } = argv
  const files = _.slice(1)
  const dest = files.pop()
  const destPath = resolvePath(dest)
  return {
    discover: await collectFilesInfo(destPath, 0, true),
  }
}

async function removeFiles(argv) {
  const files = argv._.slice(1)
  const results = []
  for (const file of files) {
    const filePath = resolvePath(file)
    console.log('filePath', filePath)
    try {
      await fs.access(filePath, fs.constants.F_OK)
    } catch {
      results.push({
        path: filePath,
        type: 'file',
        discovered: false,
      })
    }
  }
  return {
    remove: results,
  }
}

module.exports = handleCommand
