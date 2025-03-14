
const express = require('express')
const app = express()
const port = 3000;

const items = [
    { 
        id : 1,
        name : 'item no 1'
    },
    {
        id : 2,
        name : 'item no 2',
    }
]

app.get('/api/items' , (req , res) => {
    res.json(items);
})


app.listen( port , () => {
    console.log(`server is running on port:${port}`)
})