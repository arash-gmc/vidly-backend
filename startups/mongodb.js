const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config')

const db = config.get('db') 
mongoose.connect(db,{
	useNewUrlParser:true,
	useUnifiedTopology:true,
	useFindAndModify:false,
	useCreateIndex:true})
	.then(()=>winston.info(`connected to ${db}...`))
	.catch(e=>console.error('database connection error: ',e))


