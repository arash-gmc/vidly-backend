const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateId = require('../middlewares/validateId')
const mongoose = require('mongoose')
const {Genres,joiSchema} = require('../database/genres')
const inpVal = require('../middlewares/inputValidation')


router.get('/',async (req,res)=>{
	res.send(await Genres.find().sort('name'))
})

router.get('/:id',validateId(Genres),async(req,res)=>{
	genre = res.instance
	res.send(genre)
})

router.post('/',[auth,inpVal(joiSchema)],async(req,res)=>{	
	const genre = new Genres({name:req.body.name});
	await genre.save()		
	res.send(genre)	
})

router.put('/:id',[auth,inpVal(joiSchema),validateId(Genres)],async(req,res)=>{

	const result = await Genres.findByIdAndUpdate(req.params.id,{$set:{name:req.body.name}},{new:true})
	res.send(result)	
})

router.delete('/:id',[auth,admin,validateId(Genres)],async(req,res)=>{
	
	const result = await await Genres.findByIdAndRemove(req.params.id)
	res.send(result)
})

module.exports = router
