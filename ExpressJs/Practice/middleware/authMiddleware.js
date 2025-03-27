const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = ( req , res , next ) => {
    const token = req.header('Authorization');
    if(!token) return res.status(401).json({ message : 'Access Denied. No Token Provided'})

        try{
            const decoded = jwt.verify( token , process.env.JWT_SECRET);
            req.user = decoded.user;
            next();
        }
        catch(err){
            res.status(401).json( { message : 'Invalid Token'})
        }
}