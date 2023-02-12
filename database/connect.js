const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly')
	.then(()=>console.log('connected to MongoDB..'))
	.catch(err=>console.log('could not connect to MongoDB...',err));

