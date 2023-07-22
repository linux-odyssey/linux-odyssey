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
  const container = await engine.createContainer({
    ...containerOptions,
  })
  await container.start()
  return container
}

export async function getContainer(id) {
  const container = await engine.getContainer(id)
  await container.start()
  return container
}

export async function getOrCreateContainer(name) {
  try {
    const container = engine.getContainer(name)
    if (!(await container.inspect()).State.Running) {
      await container.start()
    }
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
  const exec = await container.exec({
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Cmd: ['/bin/bash'],
    Tty: true,
  })

  const execOutput = await exec.start({
    Detach: false,
    Tty: true,
  })

  return execOutput.socket
}
