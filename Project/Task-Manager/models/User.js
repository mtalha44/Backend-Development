const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/project-task-manager');

const userSchema = mongoose.Schema({
    username : { type : String , required : true },
    email : { type : String , required : true , unique : true },
    password : { type : String , required : true },
    isVerified : { type : Boolean , default : false },
    resetToken : { type : String , default : null },
    resetTokenExpiration : { type :Date , default : null },
    failedLoginAttempts : { type : Number , default : 0 },
    lockUntil : { type : Date , default : null },
    
})

// userSchema.methods.isLocked= function(){
//     return !!( this.lockUntil && this.lockUntil > Date.now()) ;
// }

module.exports = mongoose.model('User' , userSchema);