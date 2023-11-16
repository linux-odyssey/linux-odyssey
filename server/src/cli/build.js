import { getQuestDockerfiles } from '../utils/quest.js'
import { buildQuestImage } from '../containers/docker.js'

async function buildImages() {
  const quests = await getQuestDockerfiles()
  console.log(`Building ${quests.length} images`)
  return Promise.all(
    quests.map(({ id, questPath }) => {
      console.log(`Building image for ${id}`)
      return buildQuestImage(questPath, id)
    })
  )
}

buildImages()
  .then((result) => {
    console.log(result)
    console.log('Done!')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
