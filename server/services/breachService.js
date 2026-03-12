/**
 * Breach Check Service (k-Anonymity)
 * 
 * Uses HaveIBeenPwned API with k-anonymity to check if a password
 * has appeared in data breaches WITHOUT sending the full password or hash.
 * 
 * Process:
 * 1. SHA-1 hash the password
 * 2. Send only first 5 chars of hash (prefix) to HIBP API
 * 3. API returns all matching suffixes
 * 4. Check locally if full hash suffix appears in results
 * 
 * SECURITY: Full password/hash never leaves the server.
 */

const crypto = require('crypto');
const fetch = require('node-fetch');

const HIBP_API_URL = 'https://api.pwnedpasswords.com/range/';

/**
 * Check if a password has been found in known data breaches
 * @param {string} password - Password to check
 * @returns {Object} Breach check results
 */
async function checkBreach(password) {
    try {
        // Step 1: Generate SHA-1 hash of the password
        const sha1Hash = crypto
            .createHash('sha1')
            .update(password)
            .digest('hex')
            .toUpperCase();

        // Step 2: Split hash into prefix (5 chars) and suffix
        const prefix = sha1Hash.substring(0, 5);
        const suffix = sha1Hash.substring(5);

        // Step 3: Query HIBP API with only the prefix (k-anonymity)
        const response = await fetch(`${HIBP_API_URL}${prefix}`, {
            headers: {
                'User-Agent': 'SecurePass-PasswordChecker',
                'Add-Padding': 'true',   // Enable padding for extra privacy
            },
        });

        if (!response.ok) {
            throw new Error(`HIBP API returned status ${response.status}`);
        }

        const data = await response.text();

        // Step 4: Parse response and check for matching suffix
        const lines = data.split('\n');
        let breachCount = 0;
        let found = false;

        for (const line of lines) {
            const [hashSuffix, count] = line.trim().split(':');
            if (hashSuffix === suffix) {
                breachCount = parseInt(count, 10);
                found = true;
                break;
            }
        }

        return {
            found,
            count: breachCount,
            prefix,                       // Show prefix for educational purposes
            hashPreview: `${sha1Hash.substring(0, 8)}...${sha1Hash.substring(sha1Hash.length - 4)}`,
            message: found
                ? `⚠️ This password has been found in ${breachCount.toLocaleString()} data breaches!`
                : '✅ This password has not been found in any known data breaches.',
        };

    } catch (error) {
        // Don't expose internal errors to client
        console.error('[BreachService] Error checking breach:', error.message);
        return {
            found: false,
            count: 0,
            error: true,
            message: 'Unable to check breach database. Please try again later.',
        };
    }
}

module.exports = { checkBreach };
