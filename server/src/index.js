import fs from 'fs/promises'
import express from 'express'
import http from 'http'
import YAML from 'yaml'
import swaggerUI from 'swagger-ui-express'
import passport from 'passport'
import connectDB from '@linux-odyssey/models'

import './auth/passport.js'
import socketServer from './api/socket.js'
import apiRouter from './api/routes/index.js'
import loadAndUpdateQuests from './utils/quest.js'
import config from './config.js'
import errorHandler from './middleware/error.js'
import globalRateLimit from './middleware/globalRateLimit.js'
import sessionMiddleware from './middleware/session.js'
import expiryRemovalScheduler from './containers/expiryChecker.js'
import { createTestUser } from './utils/auth.js'

async function main() {
  try {
    await connectDB(config.db)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  await createTestUser()

  await loadAndUpdateQuests()
  expiryRemovalScheduler()

  const file = await fs.readFile('./swagger.yaml', 'utf8')
  const swaggerDocument = YAML.parse(file)

  const app = express()
  const server = http.createServer(app)
  socketServer(server)
  app.use(errorHandler)
  app.use(globalRateLimit)
  app.use(sessionMiddleware)
  app.use(passport.session())
  app.use(
    '/api-docs',
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocument, {
      withCredentials: true,
    })
  )
  app.use(express.json())

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.use('/api/v1', apiRouter)

  server.listen(config.port, config.host, () => {
    console.log(`Server listening at ${config.baseUrl}`)
  })
}

main().catch((err) => console.log(err))
