// session & cookie

// hum kuch bhi data frontend  par browser
// par rakh sakte hey and jab bhi app kuch
// bhi request backend par krtay ha to wo 
// frontend par saved data automaticalluy
//  backend par chly jata ha 


// tumne to beija thaplain text par server
// ko mila bilob which is not directly
// readable is liye ab is ko handle karny
// ka liye hum blob ko wapis se  readable 
// kr skatey ha
const express = require('express')
const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended : true }))
app.get('/', (req, res) => {
        res.send('Hello World!')
    })      
app.get('/about', (req, res) => {
    res.send('This is about page!')
})
app.get('/contact', (req, res) => {
    res.send('This is contact page!')
})
app.listen(3000)