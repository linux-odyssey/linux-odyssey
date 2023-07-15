import Docker from 'dockerode'

const engine = new Docker()

const containerOptions = {
  Image: 'ubuntu',
  AttachStdin: true,
  AttachStdout: true,
  AttachStderr: true,
  Tty: true,
  Cmd: ['/bin/bash'],
  OpenStdin: true,
  StdinOnce: false,
}

export async function createContainer() {
  try {
    const container = await engine.createContainer(containerOptions)
    await container.start()
    console.log(container.id)
    return container
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function attachContainer(container) {
  // Create an exec instance with bash shell
  return container.attach({
    stream: true,
    stdin: true,
    stdout: true,
    stderr: true,
  })
}
