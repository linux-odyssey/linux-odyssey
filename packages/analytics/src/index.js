import express from 'express'
import { engine } from 'express-handlebars'

const app = express()

// Setting up Handlebars as templating engine
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('home', { title: 'Linux Odyssey Admin' })
})

app.listen(3001, () => {
  console.log('Server started on http://localhost:3001')
})
