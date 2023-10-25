import { PassThrough } from 'stream'
import Docker from 'dockerode'
import { buildFileCheckCmd } from '@linux-odyssey/utils'
import config from '../config.js'

const engine = new Docker()

const containerOptions = {
  Image: 'lancatlin/linux-odyssey:helloworld',
  AttachStdin: true,
  AttachStdout: true,
  AttachStderr: true,
  Tty: true,
  OpenStdin: true,
  StdinOnce: false,
  HostConfig: {
    Binds:
      !config.isProduction && config.hostPwd
        ? [
            `${config.hostPwd}/quests/helloworld/home:/home/commander`,
            `${config.hostPwd}/packages/container:/usr/local/lib/container`,
          ]
        : [],
  },
}

const network = engine.getNetwork(config.dockerNetwork)

export async function createContainer(name) {
  const container = await engine.createContainer({
    ...containerOptions,
    name,
  })
  await network.connect({ Container: container.id })
  return container
}

export async function getAndStartContainer(id) {
  console.log(`Getting container: ${id}`)
  const container = engine.getContainer(id)
  if (!(await container.inspect()).State.Running) {
    await container.start()
  }
  return container
}

export async function attachContainer(container, { token }) {
  // Create an exec instance with bash shell
  const exec = await container.exec({
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Cmd: ['/bin/zsh'],
    Tty: true,
    Env: [
      `TOKEN=${token}`,
      `API_ENDPOINT=http://backend:3000`,
      'ZDOTDIR=/etc/zsh',
    ],
  })

  const execOutput = await exec.start({
    Detach: false,
    Tty: true,
  })

  return execOutput
}

export async function deleteContainer(id) {
  const container = engine.getContainer(id)
  if (!container) {
    return
  }
  try {
    await container.stop()
  } catch (error) {
    console.log(error)
  }
  await container.remove()
}

// Utility function to convert a stream to a string
function streamToString(stream) {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    setTimeout(() => resolve(Buffer.concat(chunks).toString('utf8')), 100)
  })
}

export async function checkFiles(id, files) {
  const container = engine.getContainer(id)
  if (!container) {
    throw new Error('Container not found')
  }

  const cmd = buildFileCheckCmd(files)
  console.log(cmd)
  const exec = await container.exec({
    AttachStdout: true,
    AttachStderr: true,
    Cmd: ['sh', '-c', cmd],
  })
  const execStream = await exec.start()
  const outStream = new PassThrough()
  const errStream = new PassThrough()

  console.log('exec started')

  exec.modem.demuxStream(execStream, outStream, errStream)
  const [output, errorOutput] = await Promise.all([
    streamToString(outStream),
    streamToString(errStream),
  ])

  console.log('output', output, 'errorOutput', errorOutput)

  const execOutput = await exec.inspect()
  console.log('exit code', execOutput.ExitCode)
  console.log('exit code === 0', execOutput.ExitCode === 0)
  return execOutput.ExitCode === 0
}
