const cookieParser = require('cookie-parser');
const express =  require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const userSchema = require('./model/user');
const jwt = require('jsonwebtoken');

app.set('view engine' , 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static(path.join(__dirname ,'public')));
app.use(cookieParser());


  
app.get('/' , (req , res) => {
        res.render('index');     
})
app.post('/sign-up' ,async (req, res) => {
    try{
        const { username , email , password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

            const user = await userSchema.create({
                   username,
                   email,
                   password : hash,
                });
                
            let token = jwt.sign( { email : email } , "secret" );
            res.cookie( "token" , token );

            res.send('You log in');
    }
    catch(err){
        console.log(err);
        res.send(err);
    }

})
app.get('/login' , (req , res) => {
    res.render('login')
})

app.post('/login' , async (req , res) => {
     try{
        const { email , password } = req.body;
        // console.log(req.cookies);
        const user = await userSchema.findOne({email});
        
        if(!user){
            return res.status(401).send('Invalid email or password.');
        }

        const result = await bcrypt.compare( password , user.password )

            if(!result){
                return res.status(401).send('Invalid email or password.');
            }

        let token = jwt.sign( { email : email } , "secret" );
        res.cookie( "token" , token );

        res.send('You log in');
     }
     catch(err){
        console.log(err);
        res.send(err);
     }
})

app.get('/logout' , (req , res) => {
    res.clearCookie('token');
    res.redirect('/');
})

//midleware to protect certain routes

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) return res.status(403).send('Invalid token.');
      req.user = decoded;
      next();
    });
  }

//here we are using midleware . its benfit is that if user is login
// then he can access this route means it can use profile until it 
// logout or until we set expiry date of token . Means if user sign
//  up and then after a day he again open a website then instead of
//  login again or sign up again we use token that store in cookies .
//  we will use that token to verify user in database and provide
//  access to it without even getting information again from user 

app.get('/protected' , authenticateToken , (req, res) => {
    res.send('This is a protected route.');
})


app.listen( 3000, () => {
    console.log('chal rha');
}) 