const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : String,
    email : String,
    post : [ {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'post'
    } ]
})

module.exports = mongoose.model('user' , userSchema);

