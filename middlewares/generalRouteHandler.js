const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const validateId = require('../middlewares/validateId')
const mongoose = require('mongoose')
const inpVal = require('../middlewares/inputValidation')

module.exports = (model,joiSchema,router)=>{
	router.get('/',async (req,res)=>{
		res.send(await model.find().sort('name'))
	})

	router.get('/:id',validateId(model),async(req,res)=>{
		record = res.instance
		res.send(record)
	})

	router.post('/',[auth,inpVal(joiSchema)],async(req,res)=>{	
		const record = new model(req.body);
		await record.save()		
		res.send(record)	
	})

	router.put('/:id',[auth,inpVal(joiSchema),validateId(model)],async(req,res)=>{

		const result = await model.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
		res.send(result)	
	})

	router.delete('/:id',[auth,admin,validateId(model)],async(req,res)=>{
		
		const result = await await model.findByIdAndRemove(req.params.id)
		res.send(result)
	})

	return router
}



