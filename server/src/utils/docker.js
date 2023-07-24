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

export async function getOrCreateContainer(id) {
  console.log(`Getting container: ${id}`)
  try {
    const container = engine.getContainer(id)
    if (!(await container.inspect()).State.Running) {
      await container.start()
    }
    return container
  } catch (error) {
    const container = await engine.createContainer({
      ...containerOptions,
      name: id,
    })
    await container.start()
    console.log(container.id)
    return container
  }
}

export async function attachContainer(container, { token }) {
  // Create an exec instance with bash shell
  const exec = await container.exec({
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Cmd: ['/bin/bash'],
    Tty: true,
    Env: [`TOKEN=${token}`],
  })

  const execOutput = await exec.start({
    Detach: false,
    Tty: true,
  })

  return execOutput.socket
}
