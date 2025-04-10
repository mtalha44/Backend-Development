const express = require('express');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const { body  , validationResult } = require('express-validator');
const userSchema = require("../models/User");
const taskSchema = require("../models/Task");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const router = express.Router();


router.post('/register' ,  [
    body('username').notEmpty().withMessage('Username can not be empty'),
    body('email').isEmail().withMessage('Email can not be empty'),
    body('password').isLength({min : 6}).withMessage('Password must be 8 charactres long'),
 ],
 async ( req , res )=> {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors : errors.array() });

        const { username , email , password } = req.body;

        try{
            const isMatch = await userSchema.findOne({email});
            if(isMatch) return res.status(400).json({ message : "Email already exists" });

            const salt =  await bcrypt.genSalt(10);
            const hash = await  bcrypt.hash( password , salt );

            await userSchema.create({
                username,
                email,
                password : hash
            })

            const token = jwt.sign({ email } , process.env.JWT_SECRET , { expiresIn : '1h' });
            res.cookie("token" , token);

            sendVerificationEmail(email , token);

            // res.render('task' , { userId : userSchema._id });
            res.status(201).json('User created successfully');
        }
        catch(error){
            console.log(error.message)
            res.status(500).json({ error : error.message });
        }
})

router.post('/create/:userId' , [
  body('topic').notEmpty().withMessage('Topic name can not be empty'),
  body('description').notEmpty().withMessage('Task description can not be empty'),
] ,
    async ( req, res ) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) return res.status(400).json({errors : errors.array() });

      const { topic , description } = req.body;

    try{  
       await taskSchema.create({
        topic,
        description,
        writer : req.params.userId, 
       })
      
       console.log('task created successfuly');
      res.redirect(`/task/app/create/${req.params.userId}`);
    }
    catch(error){
      res.status(500).json({ error : error.message });
    }
  }
)

router.get('/create/:userId' , async ( req , res ) => {
  res.render('task' , { userId : req.params.userId }); 
})

router.get('/read/:userId' , async (req , res) => {
  try{
    const userId = req.params.userId;
    const task = await taskSchema.find({writer : userId});
    
    if(!task) return res.status(400).json({ message : "Your are not allowed to access this page!"});
    
    res.render('task-read' , { task , userId });

  }   
  catch(error){
    res.status(500).json({ error : error.message });
  }

})

router.get('/edit/:taskId/:userId' , async ( req , res ) => {
  try{
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const task = await taskSchema.findOne({ _id : taskId });
    
    if(!task) return res.status(400).json({ message : "Your are not allowed to access this page!"});
    
    res.render('task-edit' , { prevtopic : task , userId});

  }   
  catch(error){
    res.status(500).json({ error : error.message });
  }
} )

router.post('/update/:prevTopicId/:userId' , async ( req, res ) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors : errors.array() });

  const userId =req.params.userId;
  const taskId = req.params.prevTopicId;

  const { newtopic , newdescription } = req.body;

      try{
          await taskSchema.findOneAndUpdate({ _id : taskId } , {
            topic : newtopic== "" ? topic : newtopic ,
            description : newdescription == "" ? description : newdescription ,
          })
          const task = await taskSchema.find({writer : userId});

          res.render('task-read' , { task , userId });
      }
      catch(error){
        res.status(500).json({ error : error.message });
      }
})

router.get('/delete/:taskId/:userId' , async ( req , res ) => {
  try{
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    await taskSchema.findOneAndDelete({ _id : taskId });
    const task = await taskSchema.find({writer : userId});
    res.render('task-read' , { task , userId });
  }
  catch(error){
    res.status(500).json({ error : error.message });
  }
})

router.get('/login' , async ( req , res ) => {
  res.render('login');
})

router.post('/login' , [
    body('email').isEmail().withMessage('Email can not be empty'),
    body('password').isLength({min : 6}).withMessage('Password must be 8 charactres long'),
],
    async ( req , res ) => {
          const errors = validationResult(req);
          if(!errors.isEmpty()) return res.status(400).json({errors : errors.array()});
          
          
          const { email , password } = req.body;
          try{
            const user = await userSchema.findOne({email});
            if(!user) return res.status(400).json({ message : "Invalid Credentials" });
            
            if(user.lockUntil <= Date.now() && user.lockUntil != null ){
              user.lockUntil = null;
              user.failedLoginAttempts= 0;
              user.save();
              // console.log(user.lockUntil , user.failedLoginAttempts);
              // return res.status(403).json({ message : "User is locked" });
            } 
            if(user.lockUntil > Date.now()){
              // console.log(user.lockUntil , user.failedLoginAttempts);
              return res.status(403).json({ message : "User is locked" });
            }
            const isMatch = await bcrypt.compare( password , user.password );
            // console.log(isMatch)   
            if(!isMatch){
              user.failedLoginAttempts += 1;
              // console.log(user.failedLoginAttempts);
              if( user.failedLoginAttempts >= 3 ){
                user.lockUntil = Date.now() + 5 * 60 * 1000 ;
                await user.save();
                return res.status(403).json({ message : "User is locked" });
              }
              await user.save();
              return res.status(400).json({ message : "Invalid Credentials" });
            } 

            const token = jwt.sign({ email } , process.env.JWT_SECRET , { expiresIn : '1h' });
            
            if(!user.isVerified){
                sendVerificationEmail( email ,token );
                return res.status(400).json({ message : "Please verify your email"});
            } 
            
            res.cookie("token" , token);

            res.render('task' , { userId : user._id });
            // res.status(201).json({message : 'Login Successfully'});
          }
          catch(error){
            res.status(500).json({ error : error.message });
          }
    }
)

router.get('/forgot-password' , async ( req , res ) => {
    res.render('forgot-password');
})

router.post('/forgot-password' , [
    body('email').isEmail().withMessage('Email can not be empty'),
], async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors : errors.array()});
    
    const { email } = req.body;
    try{
      const user = await userSchema.findOne({email});
      if(!user) return res.status(400).json({ message : "User not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");
              user.resetToken = resetToken;
              user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
              await user.save();
      
              sendResetEmail( user.email , resetToken );
      
              res.json({ message : "Password reset email sent" });
    }
    catch(error){
              res.status(500).json({ error : error.message });
    }
})

router.get('/verify-email/:token' , async ( req , res ) => { 
    try{

        const decoded = jwt.verify( req.params.token , process.env.JWT_SECRET);
        await userSchema.findOneAndUpdate({ email : decoded.email } , { isVerified : true })

        res.json({message : 'Email verified successfully'});
    }
    catch(error){
        res.status(400).json({error : error.message });
    }
})

router.get('/reset-password/:token' , async ( req , res) => {
    const { token } = req.params;
    res.render( 'reset-password' , { token } )
})

router.post('/reset-password/:token' , [
    body('password').isLength({min : 6}).withMessage('Password must be 8 charactres long'),
],async ( req , res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors : errors.array()});
    
    const { token } = req.params;
    const { password } = req.body;

    try{
        const user = await userSchema.findOne({ resetToken : token })
        if(!user) return res.status(400).json({ message : "Invalid token" });

        const resetTokenExpiration = user.resetTokenExpiration;
        if( Date.now() > resetTokenExpiration ) return res.status(400).json({message : "Token Expired"});

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password , salt);

            user.password = hash;
            user.resetToken = null;
            user.resetTokenExpiration = null;
        await user.save();

        res.json({ message : "Password reset successful" });
    }
    catch(error){
        res.status(500).json({ error : error.message });
    }
})


const sendResetEmail = async (email, token) => {
    try {
        // Create a test account on Ethereal
        let testAccount = await nodemailer.createTestAccount();
        // Create a transporter using Ethereal SMTP settings
        let transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // false for STARTTLS
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass  // generated ethereal password
          }
        });
    
        // Create the email options
        const mailOptions = {
          from: `"No Reply" <no-reply@example.com>`, // Sender address
          to: email,  // Recipient's email
          subject: 'Password Reset Request',
          text: `Click the link to Reset your Password: http://localhost:3000/task/app/reset-password/${token}`,
          html: `<p>Click <a href="http://localhost:3000/task/app/reset-password/${token}">here</a> to reset your Password.</p>`
        };
    
        // Send the email
        let info = await transporter.sendMail(mailOptions);
    
        console.log('Reset email sent:', info.response);
        // Log the preview URL provided by Ethereal
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      } catch (error) {
        console.error('Error sending verification email:', error);
      }
  };
const sendVerificationEmail = async (email, token) => {
  try {
    // Create a test account on Ethereal
    let testAccount = await nodemailer.createTestAccount();
    
    // Create a transporter using Ethereal SMTP settings
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // false for STARTTLS
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass  // generated ethereal password
      }
    });

    // Create the email options
    const mailOptions = {
      from: `"Task Manager App" <taskmanager@hotmail.com>`, // Sender address
      to: email,  // Recipient's email
      subject: 'Verify Your Email',
      text: `Click the link to verify your email: http://localhost:3000/task/app/verify-email/${token}`,
      html: `<p>Click <a href="http://localhost:3000/task/app/verify-email/${token}">here</a> to verify your email.</p>`
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);

    console.log('Verification email sent:', info.response);
    // Log the preview URL provided by Ethereal
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

module.exports = router;