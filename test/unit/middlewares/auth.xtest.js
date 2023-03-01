const auth = require('../../../middlewares/auth')
const {Users} = require('../../../database/users')
const mongoose = require('mongoose')

describe('auth',()=>{
	it('should return the inputed user',()=>{
		const _id = new mongoose.Types.ObjectId().toHexString()
		const token = new Users({email:'a',_id}).generateToken()
		const req = {
			header : jest.fn().mockReturnValue(token)
		}
		const res = {}
		const next = jest.fn()

		auth(req,res,next)

		expect(req.user.email).toBe('a')
		expect(req.user._id).toBe(_id)
	})
})