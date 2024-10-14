import fs from 'fs/promises'
import { Duplex } from 'stream'
import Docker from 'dockerode'
import config, { getQuestImage } from '../config.js'
import logger from '../utils/logger.js'
import { connectToSSH } from './ssh.js'

const engine = new Docker()

const newContainerOptions = (
  name: string,
  imageId: string,
  options: {
    binds?: string[]
  } = {}
): Docker.ContainerCreateOptions => ({
  name,
  Image: getQuestImage(imageId),
  HostConfig: {
    NetworkMode: config.docker.network,
    Binds: options.binds,
    ExtraHosts: ['host.docker.internal:host-gateway'],
  },
  ExposedPorts: {
    '22/tcp': {},
  },
})

export async function createContainer(
  name: string,
  questId: string,
  imageId: string
): Promise<Docker.Container> {
  let binds: string[] = [
    `${config.projectRoot}/config/ssh_key.pub:/ssh_key.pub:ro`,
    `${config.projectRoot}/quests/entrypoint.sh:/entrypoint.sh:ro`,
  ]
  if (await questHomeExists(questId)) {
    logger.info('Mounting quest home', questId)
    binds.push(`${config.projectRoot}/quests/${questId}/home:/etc/skel:ro`)
  }
  if (!config.isProduction && config.docker.mountQuest && imageId !== 'base') {
    logger.info('Mounting quest folder', questId)
    binds = [
      `${config.projectRoot}/quests/${questId}/home:/home/commander`,
      `${config.projectRoot}/packages/container:/usr/local/lib/container`,
    ]
  }
  const option = newContainerOptions(name, imageId, { binds })
  return engine.createContainer(option)
}

async function questHomeExists(imageId: string) {
  try {
    const stat = await fs.stat(`${config.projectRoot}/quests/${imageId}/home`)
    return stat.isDirectory()
  } catch {
    return false
  }
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
): Promise<Duplex> {
  const containerIp = (await container.inspect()).NetworkSettings.Networks[
    config.docker.network
  ].IPAddress

  for (let i = 0; i < 10; i++) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const stream = await connectToSSH(containerIp, { token })
      return stream
    } catch {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
    }
  }
  throw new Error('Failed to connect to SSH')
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
