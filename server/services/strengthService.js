/**
 * Password Strength Analysis Service
 * 
 * Analyzes password strength using multiple security metrics:
 * - Length, character diversity, entropy, dictionary check
 * - Returns score (0-100), label, and improvement suggestions
 * 
 * SECURITY: Passwords are analyzed in-memory only, never stored.
 */

// ─── Common Passwords Dictionary (top 200) ──────────────────────
const COMMON_PASSWORDS = new Set([
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', 'master',
    'dragon', '111111', 'baseball', 'iloveyou', 'trustno1', 'sunshine',
    'princess', 'football', 'charlie', 'access', 'shadow', 'michael',
    'letmein', '696969', 'batman', 'passw0rd', 'welcome', 'hello',
    'whatever', 'jordan', 'thomas', 'ranger', 'buster', 'joshua',
    'password1', 'password123', 'admin', 'administrator', 'login',
    'changeme', 'default', 'guest', 'public', 'test', 'root',
    '1q2w3e4r', 'qwerty123', 'zaq1xsw2', 'qweasdzxc', 'p@ssw0rd',
    '1234', '12345', '123456789', '1234567890', '0987654321',
    'asdfghjkl', 'zxcvbnm', '1qaz2wsx', 'qazwsx', 'abcdef',
    'pass', 'test123', 'admin123', 'root123', 'user', 'demo',
    'love', 'god', 'sex', 'secret', 'money', 'freedom', 'ninja',
    'computer', 'internet', 'server', 'database', 'network', 'security',
    'summer', 'winter', 'spring', 'autumn', 'january', 'february',
    'monday', 'friday', 'sunday', 'soccer', 'hockey', 'tennis',
    'corvette', 'ferrari', 'mercedes', 'porsche', 'mustang', 'harley',
    'cookie', 'coffee', 'pepper', 'ginger', 'butter', 'cheese',
    'killer', 'zombie', 'matrix', 'gandalf', 'superman', 'spiderman',
    'starwars', 'pokemon', 'minecraft', 'fortnite', 'roblox',
]);

// ─── Sequential / Repeated Pattern Detection ───────────────────
const SEQUENTIAL_PATTERNS = [
    'abcdefghijklmnopqrstuvwxyz',
    'zyxwvutsrqponmlkjihgfedcba',
    '01234567890',
    '09876543210',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
];

/**
 * Calculate Shannon entropy of a password
 * Higher entropy = harder to crack
 */
function calculateEntropy(password) {
    const charsetSize = getCharsetSize(password);
    if (charsetSize === 0) return 0;
    return password.length * Math.log2(charsetSize);
}

/**
 * Determine character set size based on password content
 */
function getCharsetSize(password) {
    let size = 0;
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/[0-9]/.test(password)) size += 10;
    if (/[^a-zA-Z0-9]/.test(password)) size += 33;
    return size;
}

/**
 * Check for sequential characters (abc, 123, etc.)
 */
function hasSequentialChars(password, minLen = 3) {
    const lower = password.toLowerCase();
    for (const pattern of SEQUENTIAL_PATTERNS) {
        for (let i = 0; i <= pattern.length - minLen; i++) {
            const seq = pattern.substring(i, i + minLen);
            if (lower.includes(seq)) return true;
        }
    }
    return false;
}

/**
 * Check for repeated characters (aaa, 111, etc.)
 */
function hasRepeatedChars(password, minLen = 3) {
    for (let i = 0; i <= password.length - minLen; i++) {
        const char = password[i];
        let count = 1;
        for (let j = i + 1; j < password.length && password[j] === char; j++) {
            count++;
        }
        if (count >= minLen) return true;
    }
    return false;
}

/**
 * Main password strength analysis function
 * @param {string} password - The password to analyze
 * @returns {Object} Complete strength analysis results
 */
function analyzeStrength(password) {
    let score = 0;
    const suggestions = [];
    const checks = {};

    // ── Length Analysis ──────────────────────────
    const length = password.length;
    checks.length = length;

    if (length >= 16) {
        score += 30;
    } else if (length >= 12) {
        score += 22;
    } else if (length >= 8) {
        score += 15;
    } else if (length >= 6) {
        score += 8;
    } else {
        score += 3;
        suggestions.push('Use at least 8 characters (12+ recommended)');
    }

    if (length < 8) {
        suggestions.push('Password is too short – minimum 8 characters required');
    }

    // ── Character Diversity ─────────────────────
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    checks.lowercase = hasLower;
    checks.uppercase = hasUpper;
    checks.numbers = hasDigit;
    checks.special = hasSpecial;

    if (hasLower) score += 10;
    else suggestions.push('Add lowercase letters (a-z)');

    if (hasUpper) score += 10;
    else suggestions.push('Add uppercase letters (A-Z)');

    if (hasDigit) score += 10;
    else suggestions.push('Add numbers (0-9)');

    if (hasSpecial) score += 15;
    else suggestions.push('Add special characters (!@#$%^&*)');

    // ── Entropy Score ───────────────────────────
    const entropy = calculateEntropy(password);
    checks.entropy = Math.round(entropy * 100) / 100;
    checks.charsetSize = getCharsetSize(password);

    if (entropy >= 60) {
        score += 15;
    } else if (entropy >= 40) {
        score += 10;
    } else if (entropy >= 28) {
        score += 5;
    } else {
        suggestions.push('Increase password complexity for higher entropy');
    }

    // ── Pattern Penalties ───────────────────────
    if (hasSequentialChars(password)) {
        score -= 10;
        checks.sequential = true;
        suggestions.push('Avoid sequential characters (abc, 123, qwerty)');
    } else {
        checks.sequential = false;
    }

    if (hasRepeatedChars(password)) {
        score -= 10;
        checks.repeated = true;
        suggestions.push('Avoid repeated characters (aaa, 111)');
    } else {
        checks.repeated = false;
    }

    // ── Common Password Check ──────────────────
    const isCommon = COMMON_PASSWORDS.has(password.toLowerCase());
    checks.isCommon = isCommon;

    if (isCommon) {
        score = Math.min(score, 10); // Cap at 10 if common
        suggestions.unshift('⚠️ This is a commonly used password – change immediately!');
    }

    // ── Unique Characters Bonus ────────────────
    const uniqueChars = new Set(password).size;
    const uniqueRatio = uniqueChars / password.length;
    checks.uniqueChars = uniqueChars;
    checks.uniqueRatio = Math.round(uniqueRatio * 100) / 100;

    if (uniqueRatio >= 0.8) score += 10;
    else if (uniqueRatio < 0.5) {
        suggestions.push('Use more unique characters – avoid repetition');
    }

    // ── Clamp Score ─────────────────────────────
    score = Math.max(0, Math.min(100, score));

    // ── Determine Strength Label ────────────────
    let label;
    if (score >= 80) label = 'Very Strong';
    else if (score >= 60) label = 'Strong';
    else if (score >= 40) label = 'Moderate';
    else label = 'Weak';

    // ── Crack Time Estimation ───────────────────
    const crackTime = estimateCrackTime(password);

    return {
        score,
        label,
        entropy: checks.entropy,
        charsetSize: checks.charsetSize,
        crackTime,
        checks,
        suggestions: suggestions.length > 0 ? suggestions : ['✅ Great password! Keep it safe.'],
    };
}

/**
 * Estimate crack time based on entropy and 10B guesses/sec
 */
function estimateCrackTime(password) {
    const charsetSize = getCharsetSize(password);
    const combinations = Math.pow(charsetSize, password.length);
    const guessesPerSecond = 10_000_000_000; // 10 billion

    const seconds = combinations / guessesPerSecond;

    return {
        combinations: combinations.toExponential(2),
        seconds: seconds,
        formatted: formatTime(seconds),
        guessesPerSecond: guessesPerSecond.toLocaleString(),
    };
}

/**
 * Format seconds into human-readable time string
 */
function formatTime(seconds) {
    if (!isFinite(seconds) || seconds > 1e20) return 'Centuries (effectively uncrackable)';
    if (seconds < 0.001) return 'Instantly';
    if (seconds < 1) return 'Less than a second';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;

    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.round(minutes)} minutes`;

    const hours = minutes / 60;
    if (hours < 24) return `${Math.round(hours)} hours`;

    const days = hours / 24;
    if (days < 365) return `${Math.round(days)} days`;

    const years = days / 365.25;
    if (years < 1000) return `${Math.round(years)} years`;
    if (years < 1_000_000) return `${(years / 1000).toFixed(1)} thousand years`;
    if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} million years`;
    if (years < 1e12) return `${(years / 1_000_000_000).toFixed(1)} billion years`;

    return `${years.toExponential(2)} years`;
}

module.exports = {
    analyzeStrength,
    estimateCrackTime,
    calculateEntropy,
    getCharsetSize,
};
