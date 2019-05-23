const app = require('./server/app')
const dotenv = require('dotenv')

dotenv.config()

const port = process.env.PORT || 8080

// start server
const server = app.listen(port, function () {
    console.log(`Server listening on port ${port}`)
})
