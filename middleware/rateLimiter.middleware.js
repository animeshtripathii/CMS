import rateLimit from 'express-rate-limit';
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // Time window ki duration milliseconds mein
    max: 2, // Window ke bheetar har IP ke liye maximum 2 request ki seema
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 1 minute'
    },
    standardHeaders: true, // Response mein standard rate limit headers shamil karein
    legacyHeaders: false, // Legacy rate limit headers ko omit karein
    
});