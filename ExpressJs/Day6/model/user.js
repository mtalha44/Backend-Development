const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/authTest');

const userSchema = mongoose.Schema({
    username : String,
    email : String,
    password : String
})

module.exports = mongoose.model('user' , userSchema);

