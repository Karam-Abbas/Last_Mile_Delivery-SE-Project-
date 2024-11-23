const express = require("express");
const axios = require("axios"); // For communication with other modules
const app = express();
const db = require("./config/mongooseConnection");
app.use(express.json());

const User = require("./models/userModel");
const Order = require("./models/orderModel");
const Log = require("./models/logModel");

// Function to check if user and order IDs are valid
async function checkUserAndOrder(userId, orderId) {
  try {
    // Find the user and order by their respective IDs
    const user = await User.findById(userId);
    const order = await Order.findById(orderId);

    // Check if both user and order are found
    if (!user) {
      return { valid: false, message: "User not found" };
    }

    if (!order) {
      return { valid: false, message: "Order not found" };
    }
    if (order.state !== "finalized") {
      return { valid: false, message: "Order is not finalized yet by rider" };
    }
    // If everything good, return valid
    return { user, order, valid: true };
  } catch (error) {
    console.error("Error finding user or order:", error);
    return { valid: false, message: `An error occurred: ${error.message}` };
  }  
}

app.post("/generate-opt", async (req, res) => {
  const { client_id, order_id } = req.body;
  const validationResult = await checkUserAndOrder(client_id, order_id);
  if (validationResult.valid) {
    let { user, order } = validationResult;
    const box_id = order.box_id;
    // Generate OTP
    const otp = Math.floor(Math.random() * 10000);
    // Log the OTP generation
    const logEntry = new Log({
      client_id,
      order_id,
      box_id,
      otp,
      otp_flag: true,
    });
    await logEntry.save();
    console.log(logEntry);
    res.status(200).json({ otp });
  } else {
    const logEntry = new Log({ client_id }); //user and order number not valid
    await logEntry.save();
    console.log(validationResult.message);
    res.status(400).json({ error: validationResult.message });
  }
});

app.post("/request-otp-for-matching", async (req, res) => {
  const { userId } = req.body;
  try {
    const log = await Log.find({ client_id: userId }, { otp: 1, otp_flag: 1 })
      .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order
      .limit(1);

    if (log === null || log[0].otp_flag === 0) {
      return res
        .status(400)
        .send({ message: "No latest valid OTP found for this user" });
    }
    const { otp, otp_flag } = log[0];
    res.status(200).send({ otp });
  } catch (error) {
    return res.status(400).send({
      message: `Unable to find valid OTP for user ${userId}. The latest OTP either doesn't exist or has expired.`,
    });    
  }
});
