const express = require('express')
const genres = require('./routes/genres')

const app = express()


app.use('/api/genres',genres)

const port = process.env.PORT || 3000
app.listen(port,()=>console.log(`listening on port ${port}`))