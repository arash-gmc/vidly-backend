const {Users} = require('../../../database/users')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

describe('Users',()=>{
	it('should craete a user token',()=>{
		const payload = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			isAdmin: true
		}
		user = new Users(payload)
		const token = user.generateToken();
		const decoded = jwt.verify(token,'Arash1234');
		expect(decoded).toMatchObject(payload)

		
	})
})