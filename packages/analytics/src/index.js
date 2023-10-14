import connectDB from '@linux-odyssey/models'
import express from 'express'
import { engine } from 'express-handlebars'
import config from './config.js'
import router from './router.js'

async function main() {
  await connectDB(config.db)
  const app = express()

  // Setting up Handlebars as templating engine
  app.engine('handlebars', engine())
  app.set('view engine', 'handlebars')
  app.set('views', './views')

  app.use(router)
  app.use(express.static('./public'))

  app.listen(3001, () => {
    console.log('Server started on http://localhost:3001')
  })
}

main().catch(console.error)
