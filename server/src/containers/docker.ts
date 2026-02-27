import fs from 'fs/promises'
import Docker from 'dockerode'
import config, { getQuestImage } from '../config.js'
import logger from '../utils/logger.js'

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
    '9090/tcp': {},
  },
  Env: [`BACKEND_URL=${config.backendUrl}`],
  Labels: {
    'traefik.enable': 'true',
    [`traefik.http.routers.terminal-${name}.rule`]: `PathPrefix(\`/terminal/${name}\`)`,
    [`traefik.http.middlewares.terminal-${name}-stripprefix.stripprefix.prefixes`]: `/terminal/${name}`,
    [`traefik.http.routers.terminal-${name}.middlewares`]: `terminal-${name}-stripprefix`,
    [`traefik.http.services.terminal-${name}.loadbalancer.server.port`]: '9090',
    [`traefik.http.routers.terminal-${name}.entrypoints`]: 'web',
  },
})

export async function createContainer(
  name: string,
  questId: string,
  imageId: string
): Promise<Docker.Container> {
  const binds: string[] = []
  if (await questHomeExists(questId)) {
    logger.info('Mounting quest home', questId)
    binds.push(
      `${config.docker.hostProjectRoot}/quests/${questId}/home:/etc/skel:ro`
    )
  }
  if (config.docker.mountQuest && imageId !== 'base') {
    logger.info('Mounting quest directory', questId)
    binds.push(
      `${config.docker.hostProjectRoot}/quests/${questId}/home:/home/commander`
    )
  }
  if (config.docker.mountCLI) {
    logger.info('Mounting CLI', questId)
    binds.push(
      `${config.docker.hostProjectRoot}/services/cmd-hook/bin:/usr/local/lib/cmd-hook:ro`,
      `${config.docker.hostProjectRoot}/services/terminal-service/bin:/usr/local/lib/terminal-service:ro`
    )
  }
  const option = newContainerOptions(name, imageId, { binds })
  await createNetworkIfNotExists(config.docker.network)
  return engine.createContainer(option)
}

async function createNetworkIfNotExists(network: string) {
  const dockerNetworks = await engine.listNetworks({
    filters: {
      name: [network],
    },
  })
  if (dockerNetworks.length === 0) {
    logger.log('Creating player network', network)
    await engine.createNetwork({ Name: network })
  }
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
