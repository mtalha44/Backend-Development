require('dotenv').config();
const express = require('express');
const path = require('path');
// const cors = require("cors");
const app = express();
// app.use(cors)
app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.use(express.static(path.join( __dirname , 'public')));
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;

app.use("/task/app", require("./routes/auth"));

app.get('/' , (req, res) => {
    res.render('register');
})
app.get('/login' , (req, res) => {
    res.render('login');
})

app.listen( port , () => {
    console.log(`Server running on this ${port} port`);
})