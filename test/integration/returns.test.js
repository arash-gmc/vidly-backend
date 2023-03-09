const request = require('supertest')
const {Rentals} = require('../../models/rentals')
const mongoose = require('mongoose')
const {Users} = require('../../models/users')
const {Movies} = require('../../models/movies')

describe('',()=>{
	let server
	let customerId
	let movieId
	let rental
	let movie
	let token
	let payload
	beforeEach(async()=>{
		server = require('../../index')
		customerId = mongoose.Types.ObjectId()
		movieId = mongoose.Types.ObjectId()
		payload = {movieId,customerId}
		token = new Users().generateToken()
		rental = new Rentals ({
			customers : {
				_id: customerId,
				name: 'abcdef',
				phone: '12345'
			},
			movies : {
				_id: movieId,				
				title : 'abcdef',
				dailyRentalRate: 2
			},
			
		})
		await rental.save()
		movie = new Movies({
			_id : movieId,
			title: 'movie1',
			genre : {name : 'genre1'},
			numberInStock : 2,
			dailyRentalRate : 2	
		})
		await movie.save()
	})
	afterEach(async()=>{
		await server.close();
		await Rentals.remove({})
		await Movies.remove({})
	})

	const exec = ()=>{
		return request(server)
			.post('/api/returns')
			.set('x-auth-token',token)
			.send(payload)
	}
	
	it('should return 401 if user is not loged in',async()=>{
		token = ''
		const res = await exec()
		expect(res.status).toBe(401)
	})
	
	it('should return 400 if customerId is not provided',async()=>{
		delete payload.customerId
		const res = await exec()
		expect(res.status).toBe(400)
	})

	it('should return 400 if movieId is not provided',async()=>{
		delete payload.movieId
		const res = await exec()
		expect(res.status).toBe(400)
	})

	it('should return 404 if there was no movie rental for that customerId',async()=>{
		await Rentals.remove({})
		const res = await exec()
		expect(res.status).toBe(404)
	})
	
	it('should return 400 if rental already set',async()=>{
		rental.dateReturn = Date.now()
		await rental.save()
		const res = await exec()

		expect(res.status).toBe(400)
	})
	
	
	it('should return 200 if rental is valid',async()=>{
		const res = await exec()
		expect(res.status).toBe(200)
		
		
	})

	it('should set return date if rental is valid',async()=>{
		const res = await exec()
		const rentalInDb = await Rentals.findById(rental._id);
		expect (rentalInDb).toBeTruthy()
		expect(rentalInDb.dateReturn).toBeDefined()
		expect(Date.now() - rentalInDb.dateReturn).toBeLessThan(10**4)
	})

	it('should set rental fee correctly if rental is valid',async()=>{
		rental.dateOut = new Date(Date.now() -(1000*3600*24*10.1))
		await rental.save()
		const res = await exec()
		const rentalInDb = await Rentals.findById(rental._id);
		expect(rentalInDb.rentalFee).toBeDefined()
		expect(rentalInDb.rentalFee).toBe(2*11)
	})

	it('should increase the stock of movie if rental is valid',async()=>{
		const res = await exec()
		const movieInDb = await Movies.findById(movieId)
		expect(movieInDb.numberInStock).toBe(3)
		
	})

	it('should return the rental if rental is valid',async()=>{
		const res = await exec()
		expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
			'customers','movies','rentalFee','dateOut','dateReturn'
			]))
		
	})
	
})