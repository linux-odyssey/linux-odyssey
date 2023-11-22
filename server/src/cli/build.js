import { getQuestDockerfiles } from '../utils/quest.js'
import { buildQuestImage } from '../containers/docker.js'
import logger from '../utils/logger.js'

async function buildImages() {
  const quests = await getQuestDockerfiles()
  logger.info(`Building ${quests.length} images`)
  return Promise.all(
    quests.map(({ id, questPath }) => {
      logger.info(`Building image for ${id}`)
      return buildQuestImage(questPath, id)
    })
  )
}

buildImages()
  .then((result) => {
    logger.info(result)
    logger.info('Done!')
    process.exit(0)
  })
  .catch((err) => {
    logger.error(err)
    process.exit(1)
  })
