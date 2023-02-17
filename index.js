const express = require('express')
const app = express()
const winston = require('winston')

require('./startups/logings')()
require('./startups/mongodb')
require('./startups/routes')(app)
require('./startups/validations')()


const port = process.env.PORT || 3000
app.listen(port,()=>winston.info(`listening on port ${port}`))

