/**
 * Hashing Demo Service
 * 
 * Demonstrates bcrypt hashing and salting concepts.
 * Shows how the same password produces different hashes with different salts.
 * 
 * SECURITY: Passwords are processed in-memory only, never stored.
 */

const bcrypt = require('bcryptjs');

/**
 * Generate a bcrypt hash for a given password
 * @param {string} password - Password to hash
 * @param {number} rounds - Salt rounds (4-14, default 10)
 * @returns {Object} Hash result with salt and timing info
 */
async function generateHash(password, rounds = 10) {
    const startTime = Date.now();

    // Generate a unique salt
    const salt = await bcrypt.genSalt(rounds);

    // Hash the password with the salt
    const hash = await bcrypt.hash(password, salt);

    const duration = Date.now() - startTime;

    return {
        hash,
        salt,
        rounds,
        durationMs: duration,
        explanation: [
            `Salt rounds: ${rounds} (2^${rounds} = ${Math.pow(2, rounds).toLocaleString()} iterations)`,
            `Generated salt: ${salt}`,
            `Hash generated in ${duration}ms`,
            'Each hash is unique because a new random salt is generated each time.',
            'This means the same password will produce different hashes.',
            'Bcrypt is intentionally slow to resist brute-force attacks.',
        ],
    };
}

/**
 * Compare a password against a bcrypt hash
 * @param {string} password - Password to verify
 * @param {string} hash - Bcrypt hash to compare against
 * @returns {Object} Comparison result
 */
async function compareHash(password, hash) {
    const startTime = Date.now();

    const isMatch = await bcrypt.compare(password, hash);

    const duration = Date.now() - startTime;

    return {
        isMatch,
        durationMs: duration,
        explanation: isMatch
            ? 'The password matches the hash. Bcrypt extracted the salt from the hash and re-hashed the password to verify.'
            : 'The password does not match the hash. The re-hashed password produced a different result.',
    };
}

/**
 * Generate two different hashes from the same password to demonstrate salt uniqueness
 * @param {string} password - Password to hash twice
 * @returns {Object} Two different hashes from the same password
 */
async function demonstrateSalting(password) {
    const hash1 = await bcrypt.hash(password, 10);
    const hash2 = await bcrypt.hash(password, 10);

    return {
        hash1,
        hash2,
        areDifferent: hash1 !== hash2,
        explanation: [
            'Both hashes were generated from the exact same password.',
            `Hash 1: ${hash1}`,
            `Hash 2: ${hash2}`,
            `Are they different? ${hash1 !== hash2 ? 'Yes!' : 'No (extremely rare)'}`,
            '',
            'WHY THEY DIFFER:',
            '• Each hash uses a randomly generated salt',
            '• The salt is embedded within the hash string',
            '• This prevents rainbow table attacks',
            '• Even if two users have the same password, their hashes will differ',
        ],
    };
}

module.exports = { generateHash, compareHash, demonstrateSalting };
