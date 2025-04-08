const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/authTest');

const userSchema = mongoose.Schema({
    name : { type : String , required : true },
    email : { type : String , required : true , unique : true },
    password : { type : String , required : true },
    role : { type : String , default : 'user' },
    isVerified : { type : Boolean , default : false },
    resetToken : { type : String , default : null },
    resetTokenExpiration : { type :Date , default : null },
    failedLoginAttempts :{ type :Number , default :0 },
    lockUntil : { type : Date , default :null },
})

userSchema.methods.isLocked = function(){

    return !!(this.lockUntil && this.lockUntil > Date.now());
}

module.exports = mongoose.model( 'user' , userSchema );