/**
 * Rate Limiter Middleware
 * 
 * Protects API endpoints from abuse with configurable rate limits.
 * Different limits for different endpoint sensitivity levels.
 */

const rateLimit = require('express-rate-limit');

// General rate limiter – applies to all routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,    // 15 minutes
    max: 100,                     // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests. Please try again later.',
        retryAfter: '15 minutes',
    },
});

// Strict limiter – for sensitive operations like breach checks
const strictLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,     // 1 minute
    max: 10,                      // 10 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Rate limit exceeded for this endpoint. Please wait.',
        retryAfter: '1 minute',
    },
});

// Hashing limiter – bcrypt is CPU intensive
const hashLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,     // 1 minute
    max: 5,                       // 5 hash requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Hashing rate limit exceeded. Please wait.',
        retryAfter: '1 minute',
    },
});

module.exports = { generalLimiter, strictLimiter, hashLimiter };
