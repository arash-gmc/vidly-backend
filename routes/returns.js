const express = require('express')
const Joi = require('joi')
const router = express.Router()
const auth = require('../middlewares/auth')
const {Rentals} = require('../models/rentals')
const {Movies} = require('../models/movies')
const inpVal = require('../middlewares/inputValidation')

router.post('/',[auth,inpVal(schema)],async (req,res)=>{
	const {movieId,customerId} = req.body
	const rental = await Rentals.lookup(customerId,movieId)
	
	if (!rental) return res.status(404).send('rentel not found')
	if (rental.dateReturn) return res.status(400).send('rentel already set')

	await rental.return()
	movie = await Movies.findByIdAndUpdate(
		movieId,{$inc:{numberInStock:1}}
	)	
	res.status(200).send(rental)	
})

function schema(body){
	return Joi.validate(body,{
		customerId : Joi.objectId().required(),
		movieId : Joi.objectId().required()
	})
}







module.exports = router