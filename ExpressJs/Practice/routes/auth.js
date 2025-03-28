const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const nodemailer = require('nodemailer');
const { body , validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('register' , [
    body('name').notEmpty().withMessage("Name is required"),
    body('email').isEmail().withMessage("Email is required"),
    body('password').isLength({ min : 6 }).withMessage("Password must be at least 6 characters long")
], async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors : errors.array() });

    const { name , email , password } = req.body;

    try{
        const user = await User.findOne({ email });
        if(user) return res.status(400).json({ message : "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password , salt);

        const newUser = user.create({
            name,
            email,
            password : hash
        });

        await newUser.save();

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
        await User.findOneAndUpdate({ email : decoded.email } , { isVerified : true });

        res.json({message : "Email verified successfully"});
    }
    catch(error){
        res.status(400).json({ message : "Invalid token" });
    }
});

const sendVerificationEmail = ( email ,token ) => {
    const transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user : process.env.EMAIL,
            pass : process.env.PASSWORD
        }
    });

    const mailOptions = {
        from : process.env.EMAIL,
        to : email,
        subject : 'Verify your email',
        text : `Please click on the link to verify your email: http://localhost:3000/verify-email/${token}`
    };

    transporter.sendMail(mailOptions , (error , info) => {
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent: ' + info.response);
        }
})
}

router.post( '/login' , [
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({ min : 6 }).withMessage("Password must be at least 6 characters long"),
], async (req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors : errors.array() });

    const { email , password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message : "User not found" });

        const isMatch = await bcrypt.compare( password , user.password);
        if(!isMatch) return res.status(400).json({ message : "Invalid password" });

        const token = jwt.sign({ email } , process.env.JWT_SECRET , { expiresIn : '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error : error.message });
    }
})

router.get("/admin" , authMiddleware , (req , res) => {
    if(req.user.role === "admin"){
        res.json({ message : "Welcome admin" });
    }
    else{
        res.status(403).json({ message : "Access denied" });
    }
})

module.exports = router;
