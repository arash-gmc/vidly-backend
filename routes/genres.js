const express = require('express')
const router = express.Router()
const routeHandler = require('../middlewares/generalRouteHandler')
const {Genres,joiSchema} = require('../models/genres')

module.exports = routeHandler(Genres,joiSchema,router)
