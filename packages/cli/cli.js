/* eslint-disable no-restricted-syntax */
const fs = require('fs').promises
const { exit } = require('process')
const readline = require('readline')

const RETURN_SYMBOL = '\u21B5'

process.stdin.setRawMode(true)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

function waitForEnter() {
  return new Promise((resolve) => {
    rl.once('line', resolve)
  })
}

function printResponse(response, delay) {
  return new Promise((resolve) => {
    let i = 0
    const timer = setInterval(() => {
      process.stdout.write(response[i])
      i += 1
      if (i >= response.length) {
        clearInterval(timer)
        waitForEnter().then(resolve)
      }
    }, delay)

    waitForEnter().then(() => {
      clearInterval(timer)
      process.stdout.write(response.slice(i))
      process.stdout.write('\n')
      resolve()
    })
  })
}

async function printResponses(responses, delay = 100) {
  for (const response of responses) {
    // eslint-disable-next-line no-await-in-loop
    await printResponse(response + RETURN_SYMBOL, delay)
  }
  rl.close()
}

async function readOrNone(file) {
  try {
    return await fs.readFile(file, 'utf8')
  } catch (err) {
    return ''
  }
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

  const output = await readOrNone(CMD_OUTPUT_FILE)
  const error = await readOrNone(CMD_ERROR_FILE)
  const payload = {
    command: CMD_NAME,
    output,
    error,
    exit_code: CMD_EXIT_CODE,
    token: TOKEN,
    pwd: PWD,
  }
  try {
    const res = await fetch(`${API_ENDPOINT}/api/v1/commands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.responses) {
      await printResponses(data.responses, 100)
    }
  } catch (err) {
    console.error(err)
  }
}

main()
