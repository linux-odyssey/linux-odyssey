/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const fs = require('fs').promises
const { exit } = require('process')
const readline = require('readline')

const RETURN_SYMBOL = '\u21B5'

// ANSI color map
const ANSI_COLORS = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
}

function colorize(content, color) {
  const colorCode = ANSI_COLORS[color]
  if (!colorCode) return content
  return `\x1b[${colorCode}m${content}\x1b[0m`
}

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

function printLine(content, delay, color) {
  const printContent = `${colorize(content, color)}${RETURN_SYMBOL}`
  return new Promise((resolve) => {
    let i = 0
    const timer = setInterval(() => {
      process.stdout.write(printContent[i])
      i += 1
      if (i >= printContent.length) {
        clearInterval(timer)
        waitForEnter().then(resolve)
      }
    }, delay)

    waitForEnter().then(() => {
      clearInterval(timer)
      process.stdout.write(printContent.slice(i))
      process.stdout.write('\n')
      resolve()
    })
  })
}

async function printResponses(responses, delay = 100) {
  for (const response of responses) {
    const { type, content, speaker, color } = response
    if (type === 'narrative') {
      for (const line of content) {
        await printLine(line, delay, color || 'white')
      }
    }
    if (type === 'dialogue') {
      console.log(`${speaker}:`)
      for (const line of content) {
        await printLine(`\t${line}`, delay, color || 'green')
      }
    }
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

main().then(exit).catch(console.error)
