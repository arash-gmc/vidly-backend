const express = require('express')
const app = express()
const winston = require('winston')
const config = require('config')

require('./startups/logings')()
require('./startups/config')
require('./startups/mongodb')
require('./startups/routes')(app)
require('./startups/validations')()




const port = process.env.PORT || config.get('port') || 3000
const server = app.listen(port,()=>winston.info(`listening on port ${port}`))

module.exports = server