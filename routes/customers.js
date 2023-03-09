const express = require('express')
let router = express.Router()
const routeHandler = require('../middlewares/generalRouteHandler')
const {Customers,joiSchema} = require('../models/customers')
const auth = require('../middlewares/auth')
const idVal = require('../middlewares/validateId')


const defaultRoutes = [1,1,1,1,1]

router = routeHandler(Customers,joiSchema,router,defaultRoutes)

router.put('/makeGold/:id',auth,idVal(Customers),async(req,res)=>{
	const id = req.params.id
	customer = await Customers.findByIdAndUpdate(id,{$set:{isGold:true}},{new:true})
	res.send(customer)
})

module.exports = router
