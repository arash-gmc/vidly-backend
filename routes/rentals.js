const express = require('express')
const Joi = require('joi')
const router = express.Router()
const rentalsService = require('../models/rentals')



function validation(body){
	const schema = {
		customerId : Joi.objectId().required(),
		movieId : Joi.objectId().required()
	}
	return Joi.validate(body,schema)
}


router.get('/',async (req,res)=>{ 
	res.send(await rentalsService.getAll()) 
})

router.get('/:id',async(req,res)=>{
	const rental = await rentalsService.getOne(req.params.id)
	if (!rental) return res.status(404).send('Rental Not Found')
	res.send(rental)
})

router.post('/',async(req,res)=>{
	const validationResult = validation(req.body)
	if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message)

	try {
		const databaseResult = await rentalsService.post(req.body,res)
		res.send(databaseResult)
	} catch(ex) {
		console.error('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
})


router.delete('/:id',async(req,res)=>{

	const rental = await rentalsService.getOne(req.params.id)
	if (!rental) return res.status(404).send('Rental Not Found')
	try {
		const result = await rentalsService.delete(req.params.id)
		res.send(result)
	} catch(ex) {
		console.log('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
	
})

module.exports = router

