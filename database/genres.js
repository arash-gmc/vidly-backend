const mongoose = require('mongoose')

const genresSchema = new mongoose.Schema({
	name : {type:String, required:true, minlength:3, maxlength:128}
})	

const Genres = mongoose.model('Genres',genresSchema);

async function addGenre(name){
	genre = new Genres ({
		name: name
	})
	result = await genre.save();
	return result
}

async function getAllGenres(){
	const genres = await Genres.find().sort('name');
	return genres
}

async function getGenreById(id){
	const genre = await Genres.findById(id)
	return genre
}

async function updateGenre(id,newName){
	const genre = await Genres.findByIdAndUpdate(id,{$set:{name:newName}},{new:true}) 
	return genre
}

async function deleteGenre(id){
	const genre = await Genres.findByIdAndRemove(id)
	return genre
}

module.exports = {
	getAll : getAllGenres,
	getOne : getGenreById,
	post : addGenre,
	update : updateGenre,
	delete : deleteGenre
}

module.exports.Genres = Genres
module.exports.genresSchema = genresSchema