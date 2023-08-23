import fs from 'fs/promises'
import express from 'express'
import http from 'http'
import YAML from 'yaml'
import swaggerUI from 'swagger-ui-express'

import socketServer from './api/socket.js'
import connectDB from './db.js'
import apiRouter from './api/routes/index.js'
import loadAndUpdateQuests from './utils/quest.js'
import config from './config.js'
import errorHandler from './middleware/error.js'
import expiryRemovalScheduler from './containers/expiryChecker.js'

async function main() {
  const app = express()
  const server = http.createServer(app)
  socketServer(server)
  await connectDB()
  await loadAndUpdateQuests()
  expiryRemovalScheduler()

  const file = await fs.readFile('./swagger.yaml', 'utf8')
  const swaggerDocument = YAML.parse(file)
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  app.use(express.json())

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.use('/api/v1', apiRouter)

  app.use(errorHandler)

  server.listen(config.port, config.host, () => {
    console.log(`Server listening at http://${config.host}:${config.port}`)
  })
}

main().catch((err) => console.log(err))
