const mongoose = require('mongoose');

// Helper function to generate a random Order# for each delivery
const generateOrderNumber = () => {
  return 'ORD-' + Math.floor(Math.random() * 1e8).toString().padStart(8, '0');
};
const generateOTP = () =>{
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const deliverySchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    default: generateOrderNumber, // Randomly generated Order#
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Reference to the Customer schema
    required: true
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rider', // Reference to the Rider schema
    required: true
  },
  otp: {
    code: { type: String, default: generateOTP, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  deliveryStatus: {
    type: String,
    enum: ['initial state', 'in transit', 'finalized'],
    default: 'initial state'
  },
  timestamps: {
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
  }
});

module.exports = mongoose.model('Delivery', deliverySchema);
