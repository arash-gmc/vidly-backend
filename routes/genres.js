const express = require('express')
const router = express.Router()
const Joi = require('Joi')
//const amf = require('../middlewares/async')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateId = require('../middlewares/validateId')
const genresService = require('../database/genres')
const mongoose = require('mongoose')



function validation(body){
	const schema = {
		name : Joi.string().min(5).required()
	}
	return Joi.validate(body,schema)
}



router.get('/',async (req,res)=>{
	res.send(await genresService.getAll())
})

// router.get('/',amf( async(req,res)=>{
// 	res.send(await genresService.getAll())
// }))


// router.get('/',async (req,res,next)=>{
// 	try {
// 		res.send(await genresService.getAll())
// 	} catch(e) {
// 		next(e)
// 	}   
	 
// })

router.get('/:id',validateId,async(req,res)=>{
	const genre = await genresService.getOne(req.params.id)
	if (!genre) return res.status(404).send('Genre Not Found')
	res.send(genre)
})

router.post('/',auth,async(req,res)=>{
	const validationResult = validation(req.body)
	if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message)
	try {
		const databaseResult = await genresService.post(req.body.name)
		res.send(databaseResult)
	} catch(ex) {
		console.log('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
})

router.put('/:id',auth,validateId,async(req,res)=>{

	const genre = await genresService.getOne(req.params.id)
	if (!genre) return res.status(404).send('Genre Not Found')

	const validationResult = validation(req.body)
	if (validationResult.error) return res.status(400).send(validationResult.error.details[0].message)
	try {
		const databaseResult = await genresService.update(req.params.id,req.body.name)
		res.send(databaseResult)
	} catch(ex) {
		console.log('Error: ',ex)
		res.status(500).send('There is a Problem with database connection!')
	}	
})

router.delete('/:id',[auth,admin,validateId],async(req,res)=>{

	const genre = await genresService.getOne(req.params.id)
	if (!genre) return res.status(404).send('Genre Not Found')
	try {
		const result = await genresService.delete(req.params.id)
		res.send(result)
	} catch(ex) {
		console.log('Error: ',ex)
		res.send('There is a Problem with database connection!')
	}	
	
})

module.exports = router

