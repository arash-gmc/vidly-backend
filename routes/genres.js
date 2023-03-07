const express = require('express')
const router = express.Router()
const routeHandler = require('../middlewares/generalRouteHandler')
const {Genres,joiSchema} = require('../database/genres')

module.exports = routeHandler(Genres,joiSchema,router)
