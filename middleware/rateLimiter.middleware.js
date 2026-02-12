import rateLimit from 'express-rate-limit';
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // Duration of the time window in milliseconds
    max: 2, // Restrict each IP to a maximum of 2 requests within the window
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 1 minute'
    },
    standardHeaders: true, // Include standard rate limit headers in the response
    legacyHeaders: false, // Omit legacy rate limit headers
    
});