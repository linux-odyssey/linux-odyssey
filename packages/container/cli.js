/* eslint-disable no-restricted-syntax */
const fs = require('fs').promises
const { exit } = require('process')
const minimist = require('minimist')
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

  const additionalData = await handleCommand(CMD_NAME)

  const output = await readOrNone(CMD_OUTPUT_FILE)
  const error = await readOrNone(CMD_ERROR_FILE)
  const payload = {
    command: CMD_NAME,
    output,
    error,
    exit_code: CMD_EXIT_CODE,
    pwd: PWD,
    ...additionalData,
  }
  try {
    const res = await fetch(`${API_ENDPOINT}/api/v1/commands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.responses) {
      await printResponses(data.responses, 60)
    }
    if (data.hints) {
      for (const hint of data.hints) {
        console.log(colorize(hint, 'yellow'))
      }
    }
    if (data.end) {
      console.log(colorize('Quest completed!', 'blue'))
    }
  } catch (err) {
    console.error(err)
  }
}

main().then(exit)
