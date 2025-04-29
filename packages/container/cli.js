const fs = require('fs').promises
const { exit } = require('process')
const handleCommand = require('./handleCommand.js')

const {
  API_ENDPOINT,
  TOKEN,
  PWD,
  CMD_NAME,
  CMD_OUTPUT_FILE,
  CMD_ERROR_FILE,
  CMD_EXIT_CODE,
} = process.env

async function readOrNone(file) {
  try {
    return await fs.readFile(file, 'utf8')
  } catch (_) {
    return ''
  }
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
    const response = await fetch(`${API_ENDPOINT}/api/v1/commands`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      console.error(`Failed to send command: ${response.statusText}`)
      const responseBody = await response.text()
      console.error(`Response Body: ${responseBody}`)
    }
  } catch (e) {
    console.error('Error occurred while sending command:', e)
  }
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
