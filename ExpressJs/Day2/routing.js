// routing 
//  how to get data from frontend at backend route 
// setting parser for form 


const express = require('express');
const app = express();

// setting parser for form 
app.use(express.json());
app.use(express.urlencoded({ extended : true}));

app.get( '/' , (req , res) => {
    res.send('Hello World!')
})
app.listen( 3000 , ()=> {
    console.log('chal rha')
})
