/* eslint-disable no-restricted-syntax */
const fs = require('fs').promises
const { exit } = require('process')
const minimist = require('minimist')
const axios = require('axios')
const { colorize, printResponses, printHints } = require('./print.js')
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

async function handleResponse({ responses, hints, end }) {
  if (responses) {
    await printResponses(responses, 90)
  }
  if (hints) {
    await printHints(hints, 90)
  }
  if (end) {
    console.log(colorize('Quest completed!', 'blue'))
  }
  await api.post('/commands/completed')
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
  try {
    const res = await api.post('/commands', payload)
    if (!res.data || !res.data.responses) return
    await handleResponse(res.data)
  } catch (err) {
    if (err.response) {
      console.error(err.response.data)
      return
    }
    console.error(err.message)
  }
}

main()
  .then(exit)
  .catch((err) => {
    console.log(
      '發生預期外的錯誤，請嘗試重新啟動 Quest，如果問題持續發生，請幫我們填寫右上角的錯誤回報表單。'
    )
    console.error(err)
    exit(1)
  })
