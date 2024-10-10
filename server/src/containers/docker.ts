import Docker from 'dockerode'
import config, { getQuestImage } from '../config.js'
import logger from '../utils/logger.js'

const engine = new Docker()

const containerOptions = {
  // AttachStdin: true,
  // AttachStdout: true,
  // AttachStderr: true,
  // Tty: true,
  // OpenStdin: true,
  // StdinOnce: false,
  HostConfig: {
    NetworkMode: config.docker.network,
    PortBindings: {
      '22/tcp': [
        {
          HostPort: '11122', // random port
        },
      ],
    },
  },
  ExposedPorts: {
    '22/tcp': {},
  },
} as Docker.ContainerCreateOptions

export function createContainer(
  name: string,
  imageId: string
): Promise<Docker.Container> {
  const option = {
    ...containerOptions,
    name,
    Image: getQuestImage(imageId),
  }

  if (!config.isProduction && config.docker.mountQuest && imageId !== 'base') {
    logger.info('Mounting quest folder', imageId)
    option.HostConfig!.Binds = [
      `${config.projectRoot}/quests/${imageId}/home:/home/commander`,
      `${config.projectRoot}/packages/container:/usr/local/lib/container`,
    ]
  }
  return engine.createContainer(option)
}

export async function getAndStartContainer(
  id: string
): Promise<Docker.Container> {
  logger.debug(`Getting container: ${id}`)
  const container = engine.getContainer(id)
  if (!container) {
    throw new Error(`Container ${id} not found`)
  }
  if (!(await container.inspect()).State.Running) {
    await container.start()
  }
  return container
}

export async function attachContainer(
  container: Docker.Container,
  { token }: { token: string }
) {
  const exec = await container.exec({
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Cmd: ['/bin/zsh'],
    Tty: true,
    Env: [
      `TOKEN=${token}`,
      `API_ENDPOINT=${config.backendUrl}`,
      'ZDOTDIR=/etc/zsh',
    ],
  })

  const execOutput = await exec.start({
    Detach: false,
    Tty: true,
  })

  return execOutput
}

export async function deleteContainer(id: string) {
  const container = engine.getContainer(id)
  if (!container) {
    return
  }
  try {
    await container.stop()
  } catch {
    logger.warn('Failed to stop container', id)
  }
  await container.remove()
}

function parseJSONOutput(data: string) {
  const { stream, error } = JSON.parse(data)
  if (stream) {
    // eslint-disable-next-line no-console
    console.log(stream)
  }
  if (error) {
    throw error
  }
}

export function buildQuestImage(questPath: string, questId: string) {
  return new Promise((resolve, reject) => {
    engine.buildImage(
      {
        context: questPath,
        src: ['Dockerfile', 'home'],
      },
      {
        t: getQuestImage(questId),
        networkmode: 'none',
        memory: 10 * 1e6,
      },
      (err, response) => {
        if (err) {
          reject(err)
        }
        if (response) {
          response.on('data', (data) => {
            // Process the data (this could be Docker build output)
            try {
              data
                .toString()
                .split('\n')
                .map((line: string) => line.trim())
                .filter((line: string) => line !== '')
                .forEach((line: string) => {
                  parseJSONOutput(line)
                })
            } catch (error) {
              reject(error)
            }
          })

          response.on('end', () => {
            logger.info(`Build completed for ${questId}`)
            resolve(questId)
          })

          response.on('error', (error) => {
            logger.error(`Build failed for ${questId}:`, error)
            reject(error)
          })
        }
      }
    )
  })
}
