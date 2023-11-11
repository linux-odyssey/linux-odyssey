/* eslint-disable no-restricted-syntax */
const fs = require('fs').promises
const { exit } = require('process')
const minimist = require('minimist')
const axios = require('axios')
const { colorize, printResponses } = require('./print.js')
const discoverFiles = require('./discover.js')

async function readOrNone(file) {
  try {
    return await fs.readFile(file, 'utf8')
  } catch (err) {
    return ''
  }
}

const commandListeners = {
  ls: [discoverFiles],
}

async function handleCommand(command) {
  const argv = minimist(command.split(' '))
  const name = argv._[0]
  const listeners = commandListeners[name]
  if (!listeners) return {}
  return listeners.reduce(async (result, listener) => {
    const res = await listener(argv)
    return { ...res, ...result }
  }, {})
}

async function main() {
  const {
    API_ENDPOINT,
    TOKEN,
    PWD,
    CMD_NAME,
    CMD_OUTPUT_FILE,
    CMD_ERROR_FILE,
    CMD_EXIT_CODE,
  } = process.env
  if (!CMD_NAME) exit(0)

  const api = axios.create({
    baseURL: `${API_ENDPOINT}/api/v1`,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

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
  try {
    const res = await api.post('/commands', payload)
    if (!res.data) return
    const { responses, hints, end } = res.data
    if (responses) {
      await printResponses(responses, 60)
      await api.post('/commands/completed')
    }
    if (hints) {
      for (const hint of hints) {
        console.log(colorize(hint, 'yellow'))
      }
    }
    if (end) {
      console.log(colorize('Quest completed!', 'blue'))
    }
  } catch (err) {
    if (err.response) {
      console.error(err.response.data)
      return
    }
    console.error(err.message)
  }
}

main().then(exit)
