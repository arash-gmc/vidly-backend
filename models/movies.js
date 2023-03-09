const mongoose = require('mongoose')
const Joi = require('joi')
const {genresSchema,Genres} = require('./genres')


const moviesSchema = new mongoose.Schema({
	title : {type:String, required:true, minlength:3, maxlength:64},
	genre : {type: genresSchema, required:true},
	numberInStock : {type:Number, required:true, max:255, min:0},
	dailyRentalRate : {type:Number, required:true, max:255, min:0},
	points : Object
})


const Movies = mongoose.model('Movies',moviesSchema);

const joiSchema = function (body){
	const schema = {
		title : Joi.string().min(3).required(),
		genreId : Joi.objectId().required(),
		numberInStock : Joi.number().min(0).required(),
		dailyRentalRate: Joi.number().min(0).required()
	}
	return Joi.validate(body,schema)
}


module.exports = {
	Movies,
	joiSchema
}