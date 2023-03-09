const express = require('express')
let router = express.Router()
const routeHandler = require('../middlewares/generalRouteHandler')
const auth = require('../middlewares/auth')
const inpVal = require('../middlewares/inputValidation')
const idVal = require('../middlewares/validateId')
const {Movies,joiSchema} = require('../models/movies')
const {Genres} = require('../models/genres')

const defaultRoutes = [1,1,0,0,1]

router = routeHandler(Movies,joiSchema,router,defaultRoutes)

router.post('/',[auth,inpVal(joiSchema)],async(req,res)=>{

	const {title,genreId,numberInStock,dailyRentalRate} = req.body

	genre = await Genres.findById(req.body.genreId)
	if(!genre) return res.status(404).send('movie genre not found')

	movie = new Movies({
		title,
		numberInStock,
		dailyRentalRate,
		genre: {
			_id:genre._id,
			name:genre.name
		}  
	})
	await movie.save()	
	res.send(movie)
})

router.put('/:id',[auth,inpVal(joiSchema),idVal(Movies)],async(req,res)=>{

	const id = req.params.id
	const {title,genreId,numberInStock,dailyRentalRate} = req.body

	let movie = await Movies.findById(id)
	if(!movie) return res.status(404).send('movie not found')

	genre = await Genres.findById(genreId)
	if(!genre) return res.status(404).send('movie genre not found')

	Object.assign(movie,{
		title,
		numberInStock,
		dailyRentalRate,
		genre: {
			_id:genre._id,
			name:genre.name
		}  
	})

	await movie.save()	
	res.send(movie)
})

module.exports = router
