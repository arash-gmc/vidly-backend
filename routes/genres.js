const express = require('express')
const router = express.Router()



const genres = [
{id:1 ,name:'action'},
{id:2 ,name:'romance'},
{id:3 ,name:'thriller'}
]




function validation(body){
	const schema = {
		name : Joi.string().min(3).required()
	}
	return Joi.validate(body,schema)
}

router.get('/',(req,res)=>{
	res.send(genres)
})

router.get('/:id',(req,res)=>{

	const genre = genres.find(g=>g.id===parseInt(req.params.id))
	if (!genre) return res.status(404).send('Genre Not Found')
		
	res.send(genre)

})

router.post('/',(req,res)=>{
	console.log(req.body)
	const result = validation(req.body)
	if (result.error) return res.status(400).send(result.error.details[0].message)

	const genre = {
		id: genres.length+1,
		name: req.body.name
	}
	genres.push(genre)
	res.send(genres)
})


router.put('/:id',(req,res)=>{

	const genre = genres.find(g=>g.id===parseInt(req.params.id))
	if (!genre) return res.status(404).send('Genre Not Found')

	const result = validation(req.body)
	if (result.error) return res.status(400).send(result.error.details[0].message)

	genre.name  = req.body.name
	res.send(genres)
})

router.delete('/:id',(req,res)=>{

	const genre = genres.find(g=>g.id===parseInt(req.params.id))
	if (!genre) return res.status(404).send('Genre Not Found')

	const index = genres.indexOf(genre)
	genres.splice(index,1) 
	res.send(genres)
})

module.exports = router

