const request = require('supertest')
const {Genres} = require('../../database/genres') 
const jwt = require('jsonwebtoken')
const {Users} = require('../../database/users')
let server;
let token
let name
let id

describe('/api/genres',()=>{
	beforeEach(async()=>{
		server = require('../../index')
		await Genres.remove({})
	})
	afterEach(async()=>{
		await server.close();
		await Genres.remove({})
	})
	
	describe('GET: /',()=>{
		
		it('should return all genres',async ()=>{
			Genres.collection.insertMany([
				{name:'genre1'},
				{name:'genre2'}
			])
			const res = await request(server).get('/api/genres')
			expect(res.status).toBe(200)
			expect(res.body.length).toBe(2)
			expect(res.body.some(g=>g.name=='genre1')).toBeTruthy()
		})

	})

	describe('GET: /id',()=>{
		it('should return a genre if id is valid',async ()=>{
			const genre = new Genres({name:'genre1'})
			await genre.save()
			const res = await request(server).get('/api/genres/'+genre._id);
			expect(res.status).toBe(200);
			expect(res.body).toMatchObject({name:genre.name})
		})

		it('should return a 404 response if id is not valid',async()=>{
			const res = await request(server).get('/api/genres/1');
			expect(res.status).toBe(404);
		})	
	})

	describe('POST: /',()=>{

		beforeEach(async()=>{
			token = new Users().generateToken()
			name = 'genre1'
		})
		

		const exec = ()=>{
			return request(server)
				.post('/api/genres')
				.set('x-auth-token',token)
				.send({name})
		} 
		
		it('should return a 401 error (unauthorized) if there was no authorization',async()=>{
			token = ''
			const res = await exec()
			
			expect(res.status).toBe(401)
		})

		it('should return a 400 error (bad request) if genre name was not valid',async()=>{
			name='aaa'

			const res = await exec()
							
			expect(res.status).toBe(400)
		})

		it('should return a 200 new genre if genre was successfully added',async()=>{
			
			res= await exec()
				
			expect(res.status).toBe(200)
		})
	})

	describe('PUT: /',()=>{
		beforeEach(async()=>{
			token = new Users().generateToken()
			id = await addGenre()
			name = 'genre2'
		})

		const addGenre = async()=>{
			genre = new Genres({name:'genre1'})
			await genre.save()
			return genre._id.toHexString()
		}

		const exec = async()=>{
			
			return request(server)
				.put('/api/genres/'+id)
				.set('x-auth-token',token)
				.send({name});
		}
		it('should return a 401 response if token is not provided',async()=>{
			token = ''
			const res = await exec()
			expect(res.status).toBe(401);
		})
		it('should return a 404 response if id is not valid',async()=>{
			id = 1
			const res = await exec()
			expect(res.status).toBe(404);
		})

		it('should return a 400 response if genre name is less than 5 charchter',async()=>{
			name = 'a'
			const res = await exec()
			expect(res.status).toBe(400);
		})		

		it('should return new genre if we pass correct token and genre',async ()=>{
			 res = await exec()
			 expect(res.status).toBe(200)
			 expect(res.body.name).toBe('genre2')
		})
	})

	describe('DELETE: /',()=>{
		beforeEach(async()=>{
			token = new Users({isAdmin:true}).generateToken()
			id = await addGenre()
		})

		const exec = async()=>{
			return request(server)
				.delete('/api/genres/'+id)
				.set('x-auth-token',token)
		}

		const addGenre = async()=>{
			genre = new Genres({name:'genre1'})
			await genre.save()
			return genre._id.toHexString()
		}

		it('should return a 401 response if token is not provided',async()=>{
			token = ''
			const res = await exec()
			expect(res.status).toBe(401);
		})

		it('should return 403 error if user is not admin',async()=>{
			token = new Users().generateToken()
			const res = await exec()
			expect(res.status).toBe(403)
			
		})

		it('should return a 404 response if id is not valid',async()=>{
			id = 1
			const res = await exec()
			expect(res.status).toBe(404);
		})

		it('should return removed object if remove was sucessful',async()=>{
			const res = await exec()
			expect(res.status).toBe(200)
			expect(res.body._id).toBe(id)
		})
	})
})