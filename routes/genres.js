const express = require('express')
const router = express.Router()
const routeHandler = require('../middlewares/generalRouteHandler')
const {Genres,joiSchema} = require('../models/genres')

const defaultRoutes = [1,1,1,1,1]

module.exports = routeHandler(Genres,joiSchema,router,defaultRoutes)
