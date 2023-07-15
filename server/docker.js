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

export async function getOrCreateContainer(name) {
  try {
    const container = engine.getContainer(name)
    await container.inspect()
    return container
  } catch (error) {
    const container = await engine.createContainer({
      ...containerOptions,
      name,
    })
    await container.start()
    console.log(container.id)
    return container
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
