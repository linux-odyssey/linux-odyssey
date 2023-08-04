const readline = require('readline')

process.stdin.setRawMode(true)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

async function printResponses(responses, delay = 100) {
  for (const response of responses) {
    await printResponse(response, delay)
  }
  rl.close()
}

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
      process.stdout.write(response.slice(i) + '\n')
      resolve()
    })
  })
}

async function request() {
  const { API_ENDPOINT, TOKEN, PWD, COMMAND, OUTPUT, EXIT_CODE } = process.env
  const payload = {
    command: COMMAND,
    output: OUTPUT,
    exit_code: EXIT_CODE,
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

request()
