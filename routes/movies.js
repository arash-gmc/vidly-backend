const express = require('express')
const router = express.Router()
const routeHandler = require('../middlewares/generalRouteHandler')
const {Movies,joiSchema} = require('../models/movies')



module.exports = routeHandler(Movies,joiSchema,router)
