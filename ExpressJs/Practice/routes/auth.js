const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body , validationResult } = require('express-validator');
const userSchema = require('../model/user');
require('dotenv').config();

const router = express.Router();

router.post('/register' , [
    body('username').isLength({ min : 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min : 6 }).withMessage('Password must be at least 6 characters long')
] ,
async ( req , res ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors : errors.array() });
    const { name , email , password } = req.body;
    
    try{
        let user = await userSchema.findOne({ email});
        if(user) return res.status(400).json({ message : "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user = userSchema.create(
            {
                name ,
                email ,
                password : hash
            }
        )

        const payload = { user : { id : user.id } };
        const token = jwt.sign( payload , process.env.JWT_SECRET , { expiresIn : '1h'});

        res.status(201).json({ message: 'User registered Successfully'});
    
    }
    catch(err){
        res.status(500).json({ err : err.message});
    }
})

router.post('/login' , [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').not().isEmpty().withMessage('Password field is required'),
],
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors : errors.array() });

        const { email , password } = req.body;

        try{
            let user = await userSchema.findOne({ email });
            if( !user ) return res.status(400).json({ message : 'Invalid Credentials '});

            const isMatch = await bcrypt.compare( password , user.password );
            if(!isMatch) return res.status(400).json({ message : 'Invalid Credentials '});

            const payload = { user : { id : user.id }};
            const token = jwt.sign( payload , process.env.JWT_SECRET , { expiresIn : '1h'});

            res.json({ message: 'LoginSuccessful' , token });
        }
        catch(err){
            res.status(500).json({ err : err.message});
        }
    } 
)

router.get('profile' , authMiddleware , async ( req , res ) => {
    try{
        const user = await userSchema.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
        res.status(500).json({ err : err.message});
    }
}) 
module.exports = router;