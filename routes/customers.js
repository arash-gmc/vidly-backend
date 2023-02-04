const express = require('express')
const Joi = require('Joi')
const router = express.Router()
const customersService = require('../database/customers')



function validation(body){
	const schema = {
		name : Joi.string().min(3).required(),
		isGold : Joi.boolean(),
		phone : Joi.number().required()
	}
	return Joi.validate(body,schema)
}

router.get('/',async (req,res)=>{ 
	res.send(await customersService.getAll()) 
})

router.get('/:id',async(req,res)=>{
	const customer = await customersService.getOne(req.params.id)
	if (!customer) return res.status(404).send('Customer Not Found')
	res.send(customer)
})

router.post('/',async(req,res)=>{
	const validationResult = validation(req.body)
	if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message)
	try {
		const databaseResult = await customersService.post(req.body)
		res.send(databaseResult)
	} catch(ex) {
		console.log('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
})

router.put('/:id',async(req,res)=>{

	const customer = await customersService.getOne(req.params.id)
	if (!customer) return res.status(404).send('Customer Not Found')

	const validationResult = validation(req.body)
	if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message)
	try {
		const databaseResult = await customersService.update(req.params.id,req.body)
		res.send(databaseResult)
	} catch(ex) {
		console.log('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
})

router.delete('/:id',async(req,res)=>{

	const customer = await customersService.getOne(req.params.id)
	if (!customer) return res.status(404).send('Customer Not Found')
	try {
		const result = await customersService.delete(req.params.id)
		res.send(result)
	} catch(ex) {
		console.log('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
	
})

module.exports = router

