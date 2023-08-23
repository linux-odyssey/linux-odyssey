import Docker from 'dockerode'
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
      config.isProduction && config.hostPwd
        ? []
        : [
            `${config.hostPwd}/quests/helloworld/home:/home/rudeus`,
            `${config.hostPwd}/packages/container:/usr/local/lib/container`,
          ],
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
  let container
  try {
    container = engine.getContainer(id)
    if (!(await container.inspect()).State.Running) {
      await container.start()
    }
    return container
  } catch (error) {
    throw new Error(`Container not found: ${id}`)
  }
}

export async function attachContainer(container, { token }) {
  // Create an exec instance with bash shell
  const exec = await container.exec({
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Cmd: ['/bin/zsh'],
    Tty: true,
    Env: [`TOKEN=${token}`, `API_ENDPOINT=http://backend:3000`],
  })

  const execOutput = await exec.start({
    Detach: false,
    Tty: true,
  })

  return execOutput.socket
}
