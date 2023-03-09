const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt')
const {Users} = require('../models/users');


router.post('/',async (req,res)=>{
	const result = validate(req.body)
	if (result.error) return res.status(400).send(result.error.details[0].message)
	const user = await Users.findOne({email:req.body.email})
	if (!user) return res.status(400).send('Invalid email or password')
	const passwordCheck = await bcrypt.compare(req.body.password,user.password)	
	if (!passwordCheck) return res.status(400).send('Invalid email or password')	
	const token = user.generateToken()
	res.send(token)
		
})

function validate(body){
	const schema = {
		email: Joi.string().required().email(),
		password: Joi.string().required()
	}

	return Joi.validate(body,schema)
}

module.exports = router