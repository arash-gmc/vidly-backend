const {Genres} = require('../../models/genres')
const {Users} = require('../../models/users')
const request = require('supertest')
let server
let token

xdescribe('auth middleware',()=>{
	beforeEach(async()=>{
		server = require('../../index')
	})
	afterEach(async()=>{
		await server.close();
		await Genres.remove({})
	})

	const exec = ()=>{
		return request(server)
			.post('/api/genres')
			.set('x-auth-token',token)
			.send({name:'genre1'})
			
	} 

	it('should return a 401 error if no token is provided',async()=>{
		token = ''

		const res = await exec();
		
		expect(res.status).toBe(401)		
	})

	it('should return a 400 error if token is not valid',async()=>{
		token = 'a'

		const res = await exec();
		
		expect(res.status).toBe(400)	

	})

	it('should return a valid response if token is valid',async()=>{
		token = new Users().generateToken()

		const res = await exec();
		
		expect(res.status).toBe(200)
		

	})

	
})