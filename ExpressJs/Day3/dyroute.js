//setting up parser for form
//setting up for ejs pages 
// .. kah sakte ha frontend ha htmllike
//  dikhta ha but calculation ka liye hovey
//  ha like <h1> 2 + 4 </h1>
//installejsfrom npm
//setup ejs as a middleware for view engine

//setting up public static files
//dynamic routing 
//how to get data coming from frontend at backend route
//if we create a folder with public name then we dont
//need to write like /public/images/..  insted of /images
 
//hum kai bar kuxh routes dekhtey ha un ma sirf aik hi hisa change hota ha like 
// /author/course
// /author/cours1
// /author/cours2
// /author/cours3
 
// sab se pahley browser pr jaye 
// url likhy jo humko chahiye and enter press kry
//ab us url route o create kry 
// res beijay 
//abhi usi url ko dynamic bnana ha to phir us part ka agy route mein : colun lga dey

const express = require('express');
const app = express();
const path = require('path'); //path in which that public file placed 

app.use(express.json());
app.use(express.urlencoded( {extended : true }));
app.set('view engine' , 'ejs')
app.use(express.static(path.join(__dirname , 'public' )));
app.get("/profile/:user" , function(req, res){
    
    res.send(` Welcome  ${(req.params.user )} `);
    // res.render('index')
})
app.use("/author/:username/:age" , (req , res) => {
    res.send(`Dear ${(req.params.username)} and your age is : ${(req.params.age)} `)
    res.send('chal rha ha')
})

app.listen(3000, function(){
    console.log('its running');
})