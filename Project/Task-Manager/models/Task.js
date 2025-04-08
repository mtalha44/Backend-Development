const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/project-task-manager');

const taskSchema = mongoose.Schema({
      topic : {  type : String, required : true},
      description : {  type : String, required : true},
      writer : { type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true }    
})

module.exports = mongoose.model( 'Task' , taskSchema );