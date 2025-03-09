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

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./task/${req.params.filename}`, "utf-8", (err, filedata) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).send("Error reading file");
      }
      // Now filedata contains the contents of the file
    //   console.log(filedata);
      res.render('edit', { filename: req.params.filename, filedata: filedata });
    });
  });
  

app.post('/edit', (req, res) => {
    const prevTopic = req.body['prev-topic'];
    const newTopic = req.body['new-topic'];
    // const newDescription = req.body['prev-description'];
  
    if (!prevTopic || !newTopic) {
      console.error("Missing previous or new topic");
      return res.redirect('/');
    }
    
    // Build the full file paths relative to the current directory
    const oldPath = path.join(__dirname, 'task', prevTopic);
    const newPath = path.join(__dirname, 'task', newTopic);
  
    console.log('Renaming file from:', oldPath);
    console.log('Renaming file to:', newPath);
  
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
      }
      res.redirect('/');
    });

    // for updating description

    // fs.writeFile(`./task/${newTopic}.txt` , newDescription , (err) => {
    //     if(err){
    //         console.log(err);
    //     }
    //     res.redirect("/");
    // })

  });
  
  
  

app.listen( port, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('Successfuly working');
    }
});