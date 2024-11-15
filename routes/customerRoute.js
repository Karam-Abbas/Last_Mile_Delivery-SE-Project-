const express = require('express')
const router = express.Router()
const { jwtAuthMiddleware, generateToken } = require('./../jwt')
const Customer = require('../models/customer')

router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const existingCustomer = await Customer.findOne({ username });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Username already taken' });
        }
        const newCustomer = new Customer(data)
        const response = await newCustomer.save()
        const payload = {
            id: response.id,
            username: response.username
        }
        const token = generateToken(payload)
        res.status(200).json({ response: response, token: token })
    } catch (error) {
        res.status(500).json({error: 'Unable to register User'})
    }
})
router.post('/login', async (req, res) => {
    try {
        //Extract username and password using body parser
        const { username, password } = req.body;
        //Find the username in database
        const customer = await Customer.findOne({ username: username });
        //compare password is the function we created inside personSchmea
        if (!customer || !(await customer.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid username or password' })

        }

        //generate Token
        const payload = {
            id: customer.id,
            username: customer.username
        }

        const token = generateToken(payload)

        //return token 
        res.json({ token })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        //req.user should be according to jwtAuthMiddleware in which i declared it as req.userPayload
        const customerData = req.customerPayload
        const customerId = customerData.id
        const customer = await Customer.findById(customerId)

        res.status(200).json({customer})
    }catch(error){
        console.error(error)
        res.status(500).json({error: 'Internal Server Error'})
    }
})
router.get('/orders',jwtAuthMiddleware,async(req,res)=>{
    try {
        const customerId = req.customerPayload.id
        const orders = await Delivery.find({ customer: customerId })
            .populate('rider', 'name') // Populate rider details, if needed
            .select('orderNumber otp.code deliveryStatus timestamps.createdAt'); 
        
        if (orders.length === 0){
            return res.status(404).json({ message: 'No orders found for this customer.' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving orders' });
    }
})

module.exports = router;