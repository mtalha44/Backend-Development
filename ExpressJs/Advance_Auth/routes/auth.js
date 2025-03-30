require("dotenv").config({ path: "./secret.env" });

const express = require('express');
const crypto = require('crypto');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../model/user');
const nodemailer = require('nodemailer');
const { body , validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require("../middleware/roleMiddleware");
const { loginLimiter } = require("../middleware/ratelimiter");
const user = require("../model/user");
const router = express.Router();


router.post('/register' , [
    body('name').notEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage("Email is required"),
    body('password').isLength({ min : 6 }).withMessage("Password must be at least 6 characters long")
], async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors : errors.array() });

    const { name , email , password } = req.body;

    try{
        const user = await userSchema.findOne({ email });
        if(user) return res.status(400).json({ message : "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password , salt);

        const newUser = userSchema.create({
            name,
            email,
            password : hash
        });

        // await newUser.save();

        const token = jwt.sign( { email } , process.env.JWT_SECRET , { expiresIn : '1h'} );
        sendVerificationEmail(email , token);

        res.status(201).json({ message : "User created successfully" });
    }
    catch(err){
        res.status(500).json({ error : err.message });
    }
})

router.get('/verify-email/:token' , async ( req , res) => {
    try{
        const decoded = jwt.verify(req.params.token , process.env.JWT_SECRET);
        await userSchema.findOneAndUpdate({ email : decoded.email } , { isVerified : true });

        res.json({message : "Email verified successfully"});
    }
    catch(error){
        res.status(400).json({ message : "Invalid token" });
    }
});


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
      from: `"No Reply" <no-reply@example.com>`, // Sender address
      to: email,  // Recipient's email
      subject: 'Verify Your Email',
      text: `Click the link to verify your email: http://localhost:5000/api/auth/verify-email/${token}`,
      html: `<p>Click <a href="http://localhost:5000/api/auth/verify-email/${token}">here</a> to verify your email.</p>`
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


router.post( '/login' , loginLimiter, [
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({ min : 6 }).withMessage("Password must be at least 6 characters long"),
], async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors : errors.array() });

    const { email , password } = req.body;
    
    try {
      const user = await userSchema.findOne({ email });
      if(!user) return res.status(400).json({ message : "User not found" });
      
        if (user.isLocked()) return res.status(403).json({ message : "User is locked" });

        if(!user.isVerified) return res.status(400).json({ message : "Please verify your email" });

        const isMatch = await bcrypt.compare( password , user.password);
        if(!isMatch){
          user.failedLoginAttempts += 1;
          console.log(user.failedLoginAttempts)
          
          if( user.failedLoginAttempts >=3 ){
            user.lockUntil = Date.now + 15 * 60 * 1000;
              await user.save();
              return res.status(403).json({ message : "User is locked" });
          }
          await user.save();
          return res.status(400).json({ message : "Invalid Credentials" });

        } 

        user.failedLoginAttempts = 0;
        user.lockUntil = null;
        await user.save();

        const token = jwt.sign({ email } , process.env.JWT_SECRET , { expiresIn : '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error : error.message });
    }
})

//for this i have to create a input field to verify that its user or admin
router.get("/admin" , authMiddleware , (req , res) => {
    if(req.user.role === "admin"){
        res.json({ message : "Welcome admin" });
    }
    else{
        res.status(403).json({ message : "Access denied" });
    }
})

router.get("/admin/dashboard" , authMiddleware , roleMiddleware("admin") , (req , res) => {
    res.json({ message : "Welcome admin dashboard" });
})

router.get("/forgot-password" , async (req  , res) => {
    res.render("forgot-password");
})

router.post("/forgot-password" , async(req, res) => {
    const { email } = req.body;

    try{ 
        const user = await userSchema.findOne({ email });
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

const sendResetEmail = async (email, token) => {
    try {
        // Create a test account on Ethereal
        let testAccount = await nodemailer.createTestAccount();
        console.log(token)
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
          text: `Click the link to Reset your Password: http://localhost:5000/api/auth/reset-password/${token}`,
          html: `<p>Click <a href="http://localhost:5000/api/auth/reset-password/${token}">here</a> to reset your Password.</p>`
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
  
  router.get("/reset-password/:token" , (req , res) => {
    const { token } = req.params;
    res.render("reset-password" , { token });
  })
  router.post("/reset-password/:token" , async(req , res) => {
    const { password } = req.body;
    const { token } = req.params;

    try{
        const user = await userSchema.findOne({ resetToken : token });
        if(!user) return res.status(400).json({ message : "Invalid token" });

        const resetTokenExpiration = user.resetTokenExpiration;
        if(Date.now() > resetTokenExpiration) return res.status(400).json({ message : "Token expired" });
        
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

module.exports = router;
