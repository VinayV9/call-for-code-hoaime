const express = require("express")
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongodb = require('./db/mongodb')


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + "/../client/dist"))

app.get('/', (req, res) => {
    res.sendFile('/../client/dist/index.html')
})

//routes
app.use('/api', require('./api'))

app.get('*', (req, res) => {
  res.redirect('back')
})

module.exports = app
 