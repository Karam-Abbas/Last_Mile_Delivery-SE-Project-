const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Sample service provider webhook URL
const webhookURL = 'https://webhook.site/fcfb8558-d5de-4b13-85c9-e645c67214bc'; // Replace with your unique Webhook.site URL

// Simulate an event and send notification
app.post('/trigger-event', async (req, res) => {
  const notificationData = {
    event: 'order_created',
    details: {
      orderId: 12345,
      status: 'pending',
    },
  };

  try {
    await axios.post(webhookURL, notificationData);
    console.log('Notification sent:', notificationData);
    res.status(200).send({ success: true, message: 'Notification sent.' });
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).send({ success: false, message: 'Failed to send notification.' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
