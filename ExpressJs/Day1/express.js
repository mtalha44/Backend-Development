//Express.js Framework

//introduction to express.js

//framework for nodejs
//manages everything from receiving the request and giving the response

//setting up a basic express app
//routing

//middleware    
// jab bhi server request accept krta ha waha se route
// ka beec pohanchne tak ager ap us request ko beech me
// rokte ho and kuch perform krta ho to ye 
// element middleware kehlata ha.


//error handling


//request and response handling
//npm install express



const express = require('express')
const app = express()
// console.log(app )
const port = 3000
let count =0;
app.use(( req , res , next) => {
  count++;
  console.log("Middleware",count);
  next();
}) ; // do that function before route
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/about' , (req ,res) => {
  res.send('This is about page');
})
app.get('/contact' , (req ,res ) => {
    res.send('This is contact page');
} )
app.get('/profile' , (req ,res , next) => {
    return next( new Error("Something went wrong"))
} )

//error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})