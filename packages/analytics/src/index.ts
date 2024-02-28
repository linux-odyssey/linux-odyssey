import connectDB from '@linux-odyssey/models'
import express from 'express'
import { engine } from 'express-handlebars'
import basicAuth from 'express-basic-auth'
import config from './config.js'
import router from './router.js'

async function main() {
  await connectDB(config.db)
  const app = express()

  // Setting up Handlebars as templating engine
  app.engine('handlebars', engine())
  app.set('view engine', 'handlebars')
  app.set('views', './views')

  app.use(
    basicAuth({
      users: { [config.username]: config.password },
      challenge: true,
      realm: 'Linux Odyssey Admin Dashboard',
    })
  )
  app.use(router)
  app.use(express.static('./public'))

  app.listen(config.port, config.host, () => {
    console.log(`Server started on ${config.baseUrl}`)
  })
}

main().catch(console.error)
