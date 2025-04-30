const fs = require('fs').promises
const path = require('path')
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
      boolean: ['r', 'f', 'v'],
    },
    handler: removeFiles,
  },
  rmdir: {
    opts: {
      boolean: ['p', 'v'],
    },
    handler: removeFiles,
  },
  mv: {
    handler: moveFiles,
  },
  pwd: {
    handler: showCurrentPath,
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
  if (files.length === 0) {
    return undefined
  }
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

async function moveFiles(argv) {
  const { _ } = argv
  const sources = _.slice(1)
  if (sources.length === 0) {
    return undefined
  }
  const dest = sources.pop()
  const results = {
    add: [],
    remove: [],
  }
  // check source
  for (const source of sources) {
    const sourcePath = resolvePath(source)
    try {
      await fs.access(sourcePath, fs.constants.F_OK)
    } catch {
      results.remove.push({
        path: sourcePath,
        type: 'file',
        discovered: false,
      })
    }
  }

  // check dest
  const destPath = resolvePath(dest)
  results.add = await collectFilesInfo(destPath, 0, true)
  return results
}

function showCurrentPath() {
  const pwd = process.cwd()
  const dirs = pwd.split('/')
  let currentPath = '/'
  const result = []
  for (const dir of dirs) {
    currentPath = path.join(currentPath, dir)
    result.push({
      path: currentPath,
      type: 'directory',
      discovered: true,
    })
  }
  return {
    add: result,
  }
}

module.exports = handleCommand
