import Docker from 'dockerode'
import config from '../config.js'

const engine = new Docker()

const containerOptions = {
  Image: 'lancatlin/quest-helloworld',
  AttachStdin: true,
  AttachStdout: true,
  AttachStderr: true,
  Tty: true,
  Cmd: ['/bin/bash'],
  OpenStdin: true,
  StdinOnce: false,
}

const network = engine.getNetwork(config.dockerNetwork)

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
    await network.connect({ Container: container.id })

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
    Env: [`TOKEN=${token}`, `API_ENDPOINT=http://app:3000`],
  })

  const execOutput = await exec.start({
    Detach: false,
    Tty: true,
  })

  return execOutput.socket
}
