const path = require('path')
const os = require('os')
const fs = require('fs').promises
const minimist = require('minimist')
const discoverFiles = require('./discover')

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
    const filePath = path.resolve(
      process.cwd(),
      file.replace('~', os.homedir())
    )
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

module.exports = handleCommand
