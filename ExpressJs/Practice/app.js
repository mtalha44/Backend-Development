const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/authMiddleware');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');    
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cors({
    credentials : true,
    origin : 'http://localhost:3000'
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use('/user' , userRouter);
app.use('/post' , postRouter);
app.get('/' , (req , res) => {  
    res.send('Hello World!')
})
connectDB();
app.listen(process.env.PORT , () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})