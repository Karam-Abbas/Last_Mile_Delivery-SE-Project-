const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNo: { type: String, required: true, unique: true }
});

personSchema.pre('save', async function(next){
    const customer = this;
    if(!customer.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(customer.password,salt)
        customer.password = hashedPassword;
        next()
    } catch (error) {
        return next(error)
    }
})

customerSchema.methods.comparePassword = async function(customerPassword){
    try {
        const isMatch = await bcrypt.compare(customerPassword, this.password)
        return isMatch 
    } catch (error) {
        throw error;
    }
}

module.exports = mongoose.model('Customer', customerSchema);