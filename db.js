const mongoose = require ('mongoose')
const dbUrl = 'mongodb://localhost:27017/DeliveryDetails'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('connected' , () =>{
    console.log('Database is connected...')
})

module.exports = db;