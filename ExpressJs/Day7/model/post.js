const mongoose = require('mongoose');
const user = require('./user');

const postSchema = mongoose.Schema({

    title : String,
    content : String ,
    author : { type : mongoose.Schema.Types.ObjectId ,
        ref : 'user'
    }
    
})

module.exports = mongoose.model('post' , postSchema );
