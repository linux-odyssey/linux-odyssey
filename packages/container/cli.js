/* eslint-disable no-restricted-syntax */
const path = require('path')
const os = require('os')
const fs = require('fs').promises
const { exit } = require('process')
const minimist = require('minimist')
const axios = require('axios')
const discoverFiles = require('./discover.js')

const {
  API_ENDPOINT,
  TOKEN,
  PWD,
  CMD_NAME,
  CMD_OUTPUT_FILE,
  CMD_ERROR_FILE,
  CMD_EXIT_CODE,
} = process.env

const api = axios.create({
  baseURL: `${API_ENDPOINT}/api/v1`,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
})

async function readOrNone(file) {
  try {
    return await fs.readFile(file, 'utf8')
  } catch (_) {
    return ''
  }
}

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

async function handleCommand(command) {
  const name = command.split(' ')[0]
  const listener = commandListeners[name]
  if (!listener) return {}
  const argv = minimist(command.split(' '), listener.opts)
  return listener.handler(argv)
}

async function main() {
  if (!CMD_NAME) exit(0)

  const params = await handleCommand(CMD_NAME)

  const output = await readOrNone(CMD_OUTPUT_FILE)
  const error = await readOrNone(CMD_ERROR_FILE)
  const payload = {
    command: CMD_NAME,
    output,
    error,
    exit_code: CMD_EXIT_CODE,
    pwd: PWD,
    params,
  }
  await api.post('/commands', payload)
}

main()
  .then(exit)
  .catch((err) => {
    console.log(
      '發生預期外的錯誤，請嘗試重新啟動 Quest，如果問題持續發生，請幫我們填寫右上角的錯誤回報表單。'
    )
    if (err.response && err.response.data) {
      console.log(err.response.data)
    } else {
      console.log(err)
    }
    exit(1)
  })
