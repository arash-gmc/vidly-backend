const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const router = express.Router();
const {joiSchema,Users} = require('../models/users')
const inpVal = require('../middlewares/inputValidation')
const actions = require('../middlewares/userActions')
const validateId = require('../middlewares/validateId')

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
	
	const token = user.generateToken()
	const response =  _.pick(user,['_id','name','email'])
		
	res.header('x-auth-token',token).send(response)	
})

router.get('/',auth,admin,async (req,res)=>{
	users = await Users.find().select('-password -__v')
	res.send(users)
})

router.get('/:id',async (req,res)=>{
	const {id} = req.params
	const result = Users.countDocuments({_id:id})
	res.send(result)
})

router.delete('/:id',auth,admin,validateId(Users),async (req,res)=>{
	const user = res.instance
	if (user.isAdmin)
		return res.status(403).send('you can not remove an admin user')
	const result = await Users.deleteOne({_id:user._id})
	res.send(result)
})

router.post('/action',auth,async(req,res)=>{
	await actions(req,res)	
})

module.exports = router