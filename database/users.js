const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema ({
	name: {
		type:String,
		required: true,
		minlength : 5,
		maxlength : 255,
	},
	email: {
		type: String,
		minlength : 5,
		maxlength : 255,
		required: true,
		unique : true
	},
	password: {
		type:String,
		minlength : 5,
		maxlength : 1024,
		required: true
	},
	isAdmin : Boolean
})

userSchema.methods.generateToken = function(){
	return jwt.sign({_id:this._id,isAdmin:this.isAdmin,email:this.email},'Arash1234')
}

const Users = mongoose.model('Users',userSchema)

function validation(body){
	const schema = {
		name:Joi.string().min(5).max(64).required(),
		email: Joi.string().required().min(5).max(128).email(),
		password: Joi.string().min(5).max(256).required()
	}

	return Joi.validate(body,schema)

} 

async function getOneUser(id){
	const user = await Users.findById(id).select('-password')
	if (user) return user
	return 'User not found'	
}

async function addUser({name,email,password}){
	let user = await Users.findOne({email});
	if (user) return 'This Email is already registered.'

	const salt = await bcrypt.genSalt(6);
	const hashedPassword = await bcrypt.hash(password,salt)	

	user = new Users ({
		name,
		email,
		password : hashedPassword
	})
	try {
		user = await user.save()
		const token = user.generateToken()
		const response =  _.pick(user,['_id','name','email'])
		return {token,response}
	} catch(e) {
		return e.message
	}
	
}

module.exports.validation = validation
module.exports.addUser = addUser
module.exports.Users = Users
module.exports.getOneUser = getOneUser