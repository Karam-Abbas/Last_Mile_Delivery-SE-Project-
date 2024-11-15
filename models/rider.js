const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const riderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNo: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Rider', riderSchema);