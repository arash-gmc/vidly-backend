const winston = require('winston')
//require('winston-mongodb')
require('express-async-errors')


module.exports = function(){
	winston.add(winston.transports.File,{filename:'logs.log',level:'warn'})
	//winston.add(winston.transports.MongoDB,{db:'mongodb://localhost/vidly',level:'error'})
	process.on('uncaughtException',async(ex)=>{
		console.log('!!---UNCAUGHT EXCEPTION---!!');
		winston.error(ex.message,ex)
		setTimeout(()=>{process.exit(1)},1000)
			
	})
	
		
	process.on('unhandledRejection',(ex)=>{
		console.log('!!--- UNHANDLED REJECTION ---!!');
		winston.error(ex.message,ex)
		setTimeout(()=>{process.exit(1)},1000)
	})

//	 winston.handleExceptions(
// 	new winston.transports.File({filename:'my-logs.log'}),
// 	new winston.transports.MongoDB({db:'mongodb://localhost/vidly'}),
// 	new winston.transports.Console())


}

