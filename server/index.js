import fs from 'fs'
import express from 'express'
import http from 'http'
import YAML from 'yaml'
import swaggerUI from 'swagger-ui-express'

import socketServer from './socket.js'

const port = 3000
const app = express()
const server = http.createServer(app)
socketServer(server)

const file = fs.readFileSync('./api/swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
