const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

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
	const jwtPrivateKey = config.get('jwtPrivateKey')
	return jwt.sign({_id:this._id,isAdmin:this.isAdmin,email:this.email},jwtPrivateKey)
}

const Users = mongoose.model('Users',userSchema)

const joiSchema = (body)=>{
	const schema = {
		name:Joi.string().min(5).max(64).required(),
		email: Joi.string().required().min(5).max(128).email(),
		password: Joi.string().min(5).max(256).required()
	}
	return Joi.validate(body,schema)
} 

module.exports = {
	Users,
	joiSchema
}
