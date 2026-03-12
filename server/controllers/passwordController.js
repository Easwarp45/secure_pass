/**
 * Password Controller
 * 
 * Handles all password-related API endpoints.
 * Routes call these controller functions to process requests.
 * 
 * SECURITY: No passwords are logged or stored.
 */

const { analyzeStrength } = require('../services/strengthService');
const { checkBreach } = require('../services/breachService');
const { generateHash, compareHash, demonstrateSalting } = require('../services/hashService');

/**
 * POST /api/password/analyze
 * Analyze password strength and return comprehensive results
 */
async function analyze(req, res) {
    try {
        const { password } = req.body;
        const result = analyzeStrength(password);
        res.json(result);
    } catch (error) {
        console.error('[Controller] Analyze error:', error.message);
        res.status(500).json({ error: 'Failed to analyze password' });
    }
}

/**
 * POST /api/password/breach
 * Check if password has appeared in data breaches using k-anonymity
 */
async function breach(req, res) {
    try {
        const { password } = req.body;
        const result = await checkBreach(password);
        res.json(result);
    } catch (error) {
        console.error('[Controller] Breach check error:', error.message);
        res.status(500).json({ error: 'Failed to check breach database' });
    }
}

/**
 * POST /api/password/hash
 * Generate bcrypt hash for demonstration purposes
 */
async function hash(req, res) {
    try {
        const { password, rounds } = req.body;
        const result = await generateHash(password, rounds);
        res.json(result);
    } catch (error) {
        console.error('[Controller] Hash error:', error.message);
        res.status(500).json({ error: 'Failed to generate hash' });
    }
}

/**
 * POST /api/password/compare
 * Compare a password against a bcrypt hash
 */
async function compare(req, res) {
    try {
        const { password, hash: hashStr } = req.body;
        const result = await compareHash(password, hashStr);
        res.json(result);
    } catch (error) {
        console.error('[Controller] Compare error:', error.message);
        res.status(500).json({ error: 'Failed to compare hash' });
    }
}

/**
 * POST /api/password/salt-demo
 * Demonstrate how salting produces different hashes
 */
async function saltDemo(req, res) {
    try {
        const { password } = req.body;
        const result = await demonstrateSalting(password);
        res.json(result);
    } catch (error) {
        console.error('[Controller] Salt demo error:', error.message);
        res.status(500).json({ error: 'Failed to demonstrate salting' });
    }
}

/**
 * POST /api/password/generate
 * Generate a strong random password
 */
async function generatePassword(req, res) {
    try {
        const length = Math.min(Math.max(req.body.length || 16, 8), 64);
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

        const crypto = require('crypto');
        let password = '';

        // Ensure at least one of each character type
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        password += lower[crypto.randomInt(lower.length)];
        password += upper[crypto.randomInt(upper.length)];
        password += digits[crypto.randomInt(digits.length)];
        password += special[crypto.randomInt(special.length)];

        // Fill remaining length with random characters
        for (let i = password.length; i < length; i++) {
            password += charset[crypto.randomInt(charset.length)];
        }

        // Shuffle the password using Fisher-Yates
        const arr = password.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = crypto.randomInt(i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        password = arr.join('');

        // Analyze the generated password
        const analysis = analyzeStrength(password);

        res.json({
            password,
            length: password.length,
            analysis,
        });
    } catch (error) {
        console.error('[Controller] Generate error:', error.message);
        res.status(500).json({ error: 'Failed to generate password' });
    }
}

module.exports = {
    analyze,
    breach,
    hash,
    compare,
    saltDemo,
    generatePassword,
};
