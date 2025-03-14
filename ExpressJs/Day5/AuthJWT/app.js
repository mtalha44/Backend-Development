const cookieParser = require('cookie-parser');
const express = require('express')
const app = express();
const bcrypt = require('bcrypt');

app.use(cookieParser())

//how to create a cookie
app.get('/' , (req , res) => {
    res.cookie("name" , "Talha");
    res.send("done");
})

//how to read a cookie
app.get('/read' , (req , res) => {
    res.send("read page");
    console.log(req.cookies);
})

app.listen(3002)