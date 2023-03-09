const config = require('config')

try {
	config.get('jwtPrivateKey')
} catch(ex) {
	console.error('---FATAL ERROR: jwtPrivateKey is not set---\n',ex)
	process.exit(1)
}

