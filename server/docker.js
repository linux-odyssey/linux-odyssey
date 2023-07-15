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

async function createContainer() {
  try {
    const container = await engine.createContainer(containerOptions)
    await container.start()
    return container
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function attachContainer() {
  const container = await createContainer()
  console.log(container.id)
  // Create an exec instance with bash shell

  container.attach(
    {
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true,
      ws: true,
    },
    (err, stream) => {
      stream.pipe(process.stdout)
    }
  )
}

attachContainer()
