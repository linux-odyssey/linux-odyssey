import Docker from 'dockerode'
import config from '../config.js'

const engine = new Docker()

const projectPath = '/home/zeko/src/linux-odyssey'

const containerOptions = {
  Image: 'lancatlin/linux-odyssey:helloworld',
  AttachStdin: true,
  AttachStdout: true,
  AttachStderr: true,
  Tty: true,
  OpenStdin: true,
  StdinOnce: false,
  HostConfig: {
    Binds: config.isProduction
      ? []
      : [
          `${projectPath}/server/quests/helloworld/home:/home/rudeus`,
          `${projectPath}/packages/container:/usr/local/lib/container`,
        ],
  },
}

const network = engine.getNetwork(config.dockerNetwork)

export async function getOrCreateContainer(id) {
  console.log(`Getting container: ${id}`)
  let container
  try {
    container = engine.getContainer(id)
    if (!(await container.inspect()).State.Running) {
      await container.start()
    }
    return container
  } catch (error) {
    try {
      container = await engine.createContainer({
        ...containerOptions,
        name: id,
      })
    } catch (err) {
      console.log(err)
      throw err
    }
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
    Cmd: ['/bin/zsh'],
    Tty: true,
    Env: [`TOKEN=${token}`, `API_ENDPOINT=http://app:3000`],
  })

  const execOutput = await exec.start({
    Detach: false,
    Tty: true,
  })

  return execOutput.socket
}
