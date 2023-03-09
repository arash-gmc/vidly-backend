const mongoose = require('mongoose')
const {Users} = require('../models/users')
const {Movies} = require('../models/movies')


module.exports = async(req,res)=>{

	if (req.query.action=='toggleLike'){
		if (!req.query.movieId) 
			return res.status(400).send('movie id is not provided')

		let {movieId} = req.query
		if(!mongoose.Types.ObjectId.isValid(movieId))
			return res.status(400).send('not a valid movie ID')

		const movie = await Movies.findById(movieId)
		if (!movie) return res.status(404).send('movie not found')

		const user = await Users.findById(req.user._id)
		movieId = new mongoose.Types.ObjectId(movieId)
		if (!_.some(user.likedMovies,movieId)){
			user.likedMovies.push(movieId)
			await user.save()
		}else{
			const index = _.findIndex(user.likedMovies,movieId)
			user.likedMovies.splice(index,1)
			await user.save()
		}
		
		return res.send(user.likedMovies)	
	}

	if(req.query.action=='rate'){

		if (!req.query.movieId) 
			return res.status(400).send('movie id is not provided')

		let {movieId,point} = req.query
		if(!mongoose.Types.ObjectId.isValid(movieId))
			return res.status(400).send('not a valid movie ID')

		const movie = await Movies.findById(movieId)
		if (!movie) return res.status(404).send('movie not found')

			
		if (!(point && Number.isInteger(Number(point))) )		  	
				return res.status(400).send('point is not valid')	

		point = Number(point)	
		if(point>10 || point<1)
			return res.status(400).send('point must be between 1 and 10')	
		
		const user = await Users.findById(req.user._id)
		if (!user.points)
			user.points = {}
		user.points[movieId] = point
		await user.save()

		if (!movie.points)
			movie.points = {}
		movie.points[user._id] = point
		await movie.save()
		
		
		return res.send(movie.points)	
	}


	res.status(400).send('Not a valid action.')
}