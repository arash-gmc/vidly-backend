const mongoose = require('mongoose')

const genresSchema = new mongoose.Schema({
	name : {type:String, required:true, minlength:3, maxlength:50}
})	

const Genres = mongoose.model('Genres',genresSchema);
const Joi = require('Joi')

const joiSchema = function (body){ 
	return Joi.validate(body,{
			name : Joi.string().min(3).required()
		})
}

module.exports = {
	Genres,
	genresSchema,
	joiSchema
}
