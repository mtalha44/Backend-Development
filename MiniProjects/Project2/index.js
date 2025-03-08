const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');


app.set("view engine" , "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname , "public" )));

app.set('views' , path.join(__dirname , 'views'))

const port = 3000;

app.get('/' , (req , res) => {
    fs.readdir('./task' , (err , files) => {
        if(err){
            console.log(err);
        }
        else{
            res.render('index' , { files : files});
            // console.log(data);
        }
    })
})

app.post('/create-task' , (req , res) => {
        fs.writeFile(`./task/${req.body.topic.split(' ').join('')}.txt` , req.body.description , (err) => {
            if(err){
                console.log(err);
            }
            res.redirect("/")
        })
})

app.get('/MiniProjects/Project2/task/:files' , (req , res)=>{
    fs.readFile(`./task/${req.params.files}` , "utf-8", (err , filedata) => {
        if(err)
        {
            res.send(err);
        }
        else{
            console.log(filedata)
            res.render('display' , { filename : req.params.files, filedata : filedata });    
        }
    })
})

app.listen( port, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('Successfuly working');
    }
});