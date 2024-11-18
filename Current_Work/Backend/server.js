// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');

// const app = express();
// app.use(bodyParser.json());

// // Sample service provider webhook URL
// const webhookURL = 'https://webhook.site/fcfb8558-d5de-4b13-85c9-e645c67214bc'; 

// // Simulate an event and send notification
// app.post('/trigger-event', async (req, res) => {
//   const notificationData = {
//     event: 'order_created',
//     details: {
//       orderId: 12345,
//       status: 'pending',
//     },
//   };

//   try {
//     await axios.post(webhookURL, notificationData);
//     console.log('Notification sent:', notificationData);
//     res.status(200).send({ success: true, message: 'Notification sent.' });
//   } catch (error) {
//     console.error('Error sending notification:', error.message);
//     res.status(500).send({ success: false, message: 'Failed to send notification.' });
//   }
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));





// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model('User', UserSchema);

// Routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});