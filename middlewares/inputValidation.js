
module.exports = (localSchema) => {
	return (req,res,next)=>{
		const result = localSchema(req.body)
		if (result.error) return res.status(400)
			.send(result.error.details[0].message)
		next()
	}
}