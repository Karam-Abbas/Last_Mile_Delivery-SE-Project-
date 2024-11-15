const express = require('express')
const app = express()
const db = require('./db')
const { jwtAuthMiddleware } = require('./jwt')
const bodyParser = require('body-parser')
const { customerRoute } = require('./routes/customerRoute')
const Rider = require('./models/rider'); // Import the Rider model
const Deliver = require('./models/deliverySchema'); // Import the Deliver model
const Customer = require('./models/customer'); // Import the Customer model
require('dotenv').config()

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Customer route');
});

app.use('/customer',customerRoute)

app.listen(3000, () => {
    console.log('Listening on port 3000')
})