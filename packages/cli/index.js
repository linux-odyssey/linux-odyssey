import { stdin, stdout, exit } from 'process'
import os from 'os'
import pty from 'node-pty'

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

// Create a new pseudoterminal
const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash'
const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env,
})

// Listen for output data
ptyProcess.on('data', function (data) {
  // Intercept and process the output here
  stdout.write(data)
})

// Write a command to the pseudoterminal
ptyProcess.write('ls\r')

let commandBuffer = ''

stdin.on('data', (key) => {
  if (key === '\u0004') {
    exit()
  } else if (key === '\r') {
    // User pressed enter, log and execute the command
    console.log('User command: ', commandBuffer)
    commandBuffer = ''
  } else if (key === '\u007F') {
    // User pressed backspace, remove the last character from the buffer
    commandBuffer = commandBuffer.slice(0, -1)
  } else {
    // Add the typed character to the command buffer
    commandBuffer += key
  }
  ptyProcess.write(key)
})

// Listen for exit event
ptyProcess.on('exit', function (exitCode) {
  console.log('Process exited with code: ', exitCode)
})
