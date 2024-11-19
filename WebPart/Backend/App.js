const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const axios = require('axios'); // For communication with other modules
const Log = require('./models/logmodel'); // Import the log schema

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const cors = require('cors');

// Allow requests from the frontend origin
app.use(cors({ origin: 'http://localhost:5173' })); // Replace 3001 with your frontend's port

app.use(express.json());

// MongoDB connection
mongoose
    .connect('mongodb://localhost:27017/otpModule', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// WebSocket for real-time notifications
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Function to generate a random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

app.get('/',(req,res)=>{
    res.send('OTP Module');
});

// Endpoint to handle OTP requests from Module 4
// app.post('/generate-otp', async (req, res) => {
//     const { customerId } = req.body;

//     if (!customerId) {
//         const logEntry = new Log({
//             customer_id: customerId,
//             order_no: null,
//             box_id: null,
//             otp_flag: 'failed',
//             otp: null,
//         });
//         await logEntry.save();
//         return res.status(400).json({ message: 'Customer ID is required' });
        
//     }
//     console.log(customerId);
//     // try {
//     //     // Alert Module 3 (Delivery Scheduler)
//     //     const responseModule3 = await axios.post('http://module3-url/assign-order', { customerId });

//     //     if (responseModule3.status === 200) {
//     //         const { box_id, order_no } = responseModule3.data;

//     //         // Generate OTP
//     //         const otp = generateOTP();

//     //         // Send OTP notification to the client via WebSocket
//     //         io.emit('otp-notification', { customerId, otp });

//     //         // Log results in the database
//     //         const logEntry = new Log({
//     //             customer_id: customerId,
//     //             order_no,
//     //             box_id,
//     //             otp_flag: 'success',
//     //             otp,
//     //         });
//     //         await logEntry.save();

//     //         console.log('OTP generated and sent successfully.');
//     //         return res.status(200).json({ message: 'OTP generated and sent successfully', otp });
//     //     } else {
//     //         throw new Error('Failed to assign box_id and order_no');
//     //     }
//     // } catch (error) {
//     //     console.error('Error:', error.message);

//     //     // Notify Module 3 and Module 4 about failure
//     //     io.emit('otp-failure', { customerId, error: error.message });

//     //     // Log failure in the database
//     //     const logEntry = new Log({
//     //         customer_id: customerId,
//     //         order_no: null,
//     //         box_id: null,
//     //         otp_flag: 'failed',
//     //         otp: null,
//     //     });
//     //     await logEntry.save();

//     //     return res.status(500).json({ message: 'Failed to generate OTP', error: error.message });
//     // }
// });

app.post('/generate-otp', async (req, res) => {
    const { customerId } = req.body;

    if (!customerId) {
        return res.status(400).json({ message: 'Customer ID is required' });
    }

    try {
        // Simulating successful OTP generation
        const otp = Math.floor(100000 + Math.random() * 900000);

        return res.status(200).json({
            message: 'OTP generated successfully',
            otp: otp,
        });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({
            message: 'Failed to generate OTP',
            error: error.message,
        });
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});