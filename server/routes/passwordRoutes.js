/**
 * Password Routes
 * 
 * Defines all API routes for password operations.
 * Each route uses appropriate validation and rate limiting.
 */

const express = require('express');
const router = express.Router();
const controller = require('../controllers/passwordController');
const { validate, passwordSchema, hashSchema, compareSchema } = require('../middleware/validator');
const { strictLimiter, hashLimiter } = require('../middleware/rateLimiter');

// ─── Password Analysis ─────────────────────────────────────────
router.post('/analyze', validate(passwordSchema), controller.analyze);

// ─── Breach Check (rate limited more strictly) ──────────────────
router.post('/breach', strictLimiter, validate(passwordSchema), controller.breach);

// ─── Hashing Demo (CPU intensive, rate limited) ─────────────────
router.post('/hash', hashLimiter, validate(hashSchema), controller.hash);

// ─── Hash Comparison ────────────────────────────────────────────
router.post('/compare', hashLimiter, validate(compareSchema), controller.compare);

// ─── Salt Demo ──────────────────────────────────────────────────
router.post('/salt-demo', hashLimiter, validate(passwordSchema), controller.saltDemo);

// ─── Password Generator ────────────────────────────────────────
router.post('/generate', controller.generatePassword);

module.exports = router;
