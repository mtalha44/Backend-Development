const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('./model/user')
const postSchema = require('./model/post');
const path = require('path');

const app = express();

app.set('view engine' , 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname ,'public')));

mongoose.connect('mongodb://localhost:27017/datassociation')
.then( () => console.log('MongoDB Connected'))
.catch( err => console.log(err));

app.get('/' , (req , res) => {
    res.render('index')
})

app.post('/create-user' , async ( req , res ) => {
    try{
        const user = await userSchema.create ( {
            username : req.body.username ,
            email : req.body.email
        });
        await user.save();
        // res.send(user)
        res.render('post' , { userId : user._id });
        // res.status(201).json(user);
    }
    catch(err){
        res.status(500).json({err : err.message})
    }
})
app.post('/create-post/:userId' , async ( req , res ) => {
    try{
        const post = await postSchema.create ( {
            title : req.body.title ,
            content : req.body.content,
            author : req.params.userId
        });
        await post.save();

        await userSchema.findByIdAndUpdate(req.params.userId , { $push : { post : post._id } } , { new : true } );
 
        // res.send(post)
        res.redirect(`/user/${req.params.userId}`);
        // res.status(201).json(post);
    }
    catch(err){
        res.status(500).json({err : err.message})
    }
})

app.get('/user/:userId' , async (req , res) => {
    try{
        const user = await userSchema.findById( req.params.userId ).populate('post');
        if(!user){
            return res.status(404).json({ message : "User not found" })
        }
        res.json(user);
    }
    catch(err){
        res.status(500).json({ error : err.message });
    }
})

app.listen( 3000 , () => {
    console.log("Server running on port 3000");
})

