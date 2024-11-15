const express = require('express')
const app = express()
const db = require('./db')
const { jwtAuthMiddleware } = require('./jwt')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use('/customer',jwtAuthMiddleware,customerRoutes)


app.listen(3000, () => {
    console.log('Listening on port 3000')
})