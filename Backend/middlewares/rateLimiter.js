const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        msg: "Too many attempts from this IP, please try again after 15 minutes."
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 3,
    message: {
        msg: "Too many reset attempts. Please try again after an hour."
    }
});

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: {
        msg: "Slow down! You're making too many requests."
    }
});

module.exports = { authLimiter, resetPasswordLimiter, apiLimiter };