const jwt = require('jsonwebtoken')


module.exports = function (req,res,next){
	const token = req.header('x-auth-token');
	if(!token) return res.status(401).send('No token provided')
	
	try {
		const decoded = jwt.verify(token,'Arash1234')
		req.user = decoded
		next()
	} catch(e) {
		res.status(400).send('Invalid token.')
	}
	
}