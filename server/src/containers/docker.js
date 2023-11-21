import Docker from 'dockerode'
import config, { getQuestImage } from '../config.js'
import logger from '../utils/logger.js'

const engine = new Docker()

const containerOptions = {
  AttachStdin: true,
  AttachStdout: true,
  AttachStderr: true,
  Tty: true,
  OpenStdin: true,
  StdinOnce: false,
  HostConfig: {
    NetworkMode: config.docker.network,
  },
}

// const network = engine.getNetwork(config.dockerNetwork)

export function createContainer(name, questId) {
  const option = {
    ...containerOptions,
    name,
    Image: getQuestImage(questId),
  }
  if (!config.isProduction && config.hostPwd && config.mountQuest) {
    option.HostConfig.Bind = [
      `${config.hostPwd}/quests/${config.mountQuest}/home:/home/commander`,
      `${config.hostPwd}/packages/container:/usr/local/lib/container`,
    ]
  }
  return engine.createContainer(option)
}

export async function getAndStartContainer(id) {
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

export async function attachContainer(container, { token }) {
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
    logger.warn(error)
  }
  await container.remove()
}

export function buildQuestImage(questPath, questId) {
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
        response.on('data', (data) => {
          // Process the data (this could be Docker build output)
          const { stream, error } = JSON.parse(data.toString())
          if (stream) {
            logger.info(stream)
          }
          if (error) {
            logger.error(error)
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
    )
  })
}
