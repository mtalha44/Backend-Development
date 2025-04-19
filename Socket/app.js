// const { server } = require("socket.io");

const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require('socket.io');
const { disconnect } = require("process");
const app= express();

app.use(express.json());
app.use(express.urlencoded({extended : true}))

const server =http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname , "public")));
app.set('view engine' , 'ejs');

app.get('/' , (req , res) => {
    res.render('index');
})

io.on('connection' , (socket) => {
    socket.on('user-message' , (msg) => {
        io.emit('message' , msg);
    })
    socket.on('disconnect' , () =>{
        console.log('User Disconnected');
    })
})

server.listen(port , () => {
    console.log(`Server listening at port :${port}`)
})