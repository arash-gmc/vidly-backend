const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config')

const db = config.get('db') 
mongoose.connect(db)
	.then(()=>winston.info(`connected to ${db}...`))


