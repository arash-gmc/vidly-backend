const express = require('express')
const Joi = require('Joi')
Joi.objectId = require('joi-objectid')(Joi)
require('./database/connect')
const genres = require('./routes/genres')
const movies = require('./routes/movies')
const customers = require('./routes/customers')
const rentals = require('./routes/rentals')


const app = express()
app.use(express.json())


app.use('/api/genres',genres)
app.use('/api/movies',movies)
app.use('/api/customers',customers)
app.use('/api/rentals',rentals)

const port = process.env.PORT || 3000
app.listen(port,()=>console.log(`listening on port ${port}`))