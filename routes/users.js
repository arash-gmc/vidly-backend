const express = require('express');
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')
const router = express.Router();
const {validation,addUser,getOneUser} = require('../database/users')

router.get('/me',auth,async(req,res)=>{
	const _id = req.user._id
	res.send(await getOneUser(req.user._id))
})


router.post('/',async (req,res)=>{
	const result = validation(req.body)
	if (result.error) return res.status(400).send(result.error.details[0].message)
	const {token,response} = await addUser(req.body)
	res.header('x-auth-token',token).send(response)
		
})

module.exports = router