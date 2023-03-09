const mongoose = require('mongoose')
const Joi = require('joi')
const customersSchema = new mongoose.Schema({
	name : {type:String, required:true, minlength:3, maxlength:128},
	isGold : {type: Boolean, default:false},
	phone : {type:Number }
	
})	

const Customers = mongoose.model('Customers',customersSchema);

function joiSchema(body){
	return Joi.validate(body,{
		name : Joi.string().min(3).required(),
		phone : Joi.number().required()
	})
}

module.exports = {
	Customers,
	joiSchema
}