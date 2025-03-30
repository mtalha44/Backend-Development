const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs : 60 * 1000,
    max : 5,
    message : "Too many login attempts from this IP, please try again after 60 seconds"
})

module.exports = {loginLimiter};