/**
 * Input Validation Middleware
 * 
 * Uses Joi to validate and sanitize all incoming data.
 * Prevents injection attacks and ensures data integrity.
 */

const Joi = require('joi');

// Schema for password analysis requests
const passwordSchema = Joi.object({
    password: Joi.string()
        .min(1)
        .max(128)
        .required()
        .messages({
            'string.empty': 'Password cannot be empty',
            'string.max': 'Password cannot exceed 128 characters',
            'any.required': 'Password is required',
        }),
});

// Schema for hashing requests
const hashSchema = Joi.object({
    password: Joi.string()
        .min(1)
        .max(128)
        .required()
        .messages({
            'string.empty': 'Password cannot be empty',
            'string.max': 'Password cannot exceed 128 characters',
            'any.required': 'Password is required',
        }),
    rounds: Joi.number()
        .integer()
        .min(4)
        .max(14)
        .default(10)
        .messages({
            'number.min': 'Rounds must be at least 4',
            'number.max': 'Rounds cannot exceed 14',
        }),
});

// Schema for hash comparison
const compareSchema = Joi.object({
    password: Joi.string()
        .min(1)
        .max(128)
        .required(),
    hash: Joi.string()
        .min(1)
        .max(256)
        .required(),
});

/**
 * Generic validation middleware factory
 * @param {Joi.Schema} schema - Joi schema to validate against
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,   // Remove unknown fields for security
        });

        if (error) {
            const messages = error.details.map((d) => d.message);
            return res.status(400).json({
                error: 'Validation failed',
                details: messages,
            });
        }

        req.body = value;        // Use sanitized values
        next();
    };
};

module.exports = {
    validate,
    passwordSchema,
    hashSchema,
    compareSchema,
};
