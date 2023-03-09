const express = require('express')
const router = express.Router()
const routeHandler = require('../middlewares/generalRouteHandler')
const {Customers,joiSchema} = require('../models/customers')

module.exports = routeHandler(Customers,joiSchema,router)
