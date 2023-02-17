const mongoose = require('mongoose');
const winston = require('winston')

mongoose.connect('mongodb://localhost/vidly')
	.then(()=>winston.info('connected to MongoDB...'))