const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/autPrac');

const userSchema = mongoose.Schema({
    name : { type : String , required : true },
    email : { type : String , required : true , unique : true },
    password : { type : String , required : true },
    createdAt : { type : Date , default : Date.now }, 

})

module.exports = mongoose.model('user' , userSchema);

