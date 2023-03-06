const mongoose = require('mongoose');
module.exports = (model)=>{
	return async function (req,res,next){
			if(!mongoose.Types.ObjectId.isValid(req.params.id))
				return res.status(404).send('id is not correct')
			const instance = await model.findById(req.params.id)
			if (!instance) return res.status(404).send('Not Found')
			res.instance = instance	
			next()
	}
}

