const mongoose = require('mongoose')
const {genresSchema,Genres} = require('./genres')


const moviesSchema = new mongoose.Schema({
	title : {type:String, required:true, minlength:3, maxlength:64},
	genre : {type: genresSchema, required:true},
	numberInStock : {type:Number, required:true, max:255, min:0},
	dailyRentalRate : {type:Number, required:true, max:255, min:0}
})


const Movies = mongoose.model('Movies',moviesSchema);


async function getAllMovies(){
	const movies = await Movies.find();
	return movies
}

async function getMovieById(id){
	const movie = await Movies.findById(id)
	return movie
}

async function addMovie(body,res){
	const {title,genreId,numberInStock,dailyRentalRate} = body
	const genre = await Genres.findById(genreId)
	if (!genre) return res.status(404).send('Genre Not Found')
	
	movie = new Movies ({
		title,
		genre:new Genres({
			_id : genre._id,
			name: genre.name
		}),
		numberInStock,
		dailyRentalRate
	})
	await movie.save();
	return movie
}

async function updateMovie(id,body){
	const {title,genreId,numberInStock,dailyRentalRate} = body
	const genre = await Genres.findById(genreId)
	if (!genre) return res.status(404).send('Genre Not Found')
	const movie = await Movies.findByIdAndUpdate(id,{$set:{
		title,
		genre:{
			_id: genre._id,
			name: genre.name
		},
		numberInStock,
		dailyRentalRate
	}},{new:true}) 
	return movie
}

async function deleteMovie(id){
	const movie = await Movies.findByIdAndRemove(id)
	return movie
}

module.exports = {
	getAll : getAllMovies,
	getOne : getMovieById,
	post : addMovie,
	update : updateMovie,
	delete : deleteMovie,
	Movies
}