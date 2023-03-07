const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middlewares/auth')
const router = express.Router();
const {joiSchema,Users} = require('../database/users')
const inpVal = require('../middlewares/inputValidation')

router.get('/me',auth,async(req,res)=>{
	const id = req.user._id
	const user = await Users.findById(id).select('-password')
	res.send(user)
})


router.post('/',inpVal(joiSchema),async (req,res)=>{
	const {name,email,password} = req.body
	let user = await Users.findOne({email});
	if (user) return res.status(400)
		.send('This Email is already registered.')

	const salt = await bcrypt.genSalt(6);
	const hashedPassword = await bcrypt.hash(password,salt)	

	user = new Users ({
		name,
		email,
		password : hashedPassword
	})
	
	user = await user.save()
	const token = user.generateToken()
	const response =  _.pick(user,['_id','name','email'])
		
	res.header('x-auth-token',token).send(response)	
})

router.post('/action',async(req,res)=>{
	res.send('hello beutiful')
})

module.exports = router