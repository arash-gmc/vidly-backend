const express = require('express')
const router = express.Router()
const moviesService = require('../database/movies')
const Joi = require('Joi')



function validation(body){
	const schema = {
		title : Joi.string().min(3).required(),
		genreId : Joi.objectId().required(),
		numberInStock : Joi.number().min(0).required(),
		dailyRentalRate: Joi.number().min(0).required()
	}
	return Joi.validate(body,schema)
}

router.get('/',async (req,res)=>{ 
	res.send(await moviesService.getAll()) 
})

router.get('/:id',async(req,res)=>{
	const movie = await moviesService.getOne(req.params.id)
	if (!movie) return res.status(404).send('Movie Not Found')
	res.send(movie)
})

router.post('/',async(req,res)=>{
	const validationResult = validation(req.body)
	if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message)
	try {
		const databaseResult = await moviesService.post(req.body,res)
		res.send(databaseResult)
	} catch(ex) {
		console.log('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
})

router.put('/:id',async(req,res)=>{

	const movie = await moviesService.getOne(req.params.id)
	if (!movie) return res.status(404).send('Movie Not Found')

	const validationResult = validation(req.body)
	if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message)
	try {
		const databaseResult = await moviesService.update(req.params.id,req.body)
		res.send(databaseResult)
	} catch(ex) {
		console.log('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
})

router.delete('/:id',async(req,res)=>{
	const movie = await moviesService.getOne(req.params.id)
	if (!movie) return res.status(404).send('Movie Not Found')
	try {
		const result = await moviesService.delete(req.params.id)
		res.send(result)
	} catch(ex) {
		console.log('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
	
})

module.exports = router

