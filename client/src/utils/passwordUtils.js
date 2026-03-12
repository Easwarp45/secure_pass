/**
 * Password Utility Functions (Client-side)
 * 
 * Client-side utilities for instant feedback before server analysis.
 * These provide real-time UI updates while the server does deep analysis.
 */

/**
 * Get strength color based on score
 * @param {number} score - Password score (0-100)
 * @returns {Object} Color configuration
 */
export function getStrengthColor(score) {
    if (score >= 80) return { color: '#00f5d4', bg: 'rgba(0,245,212,0.15)', label: 'Very Strong', class: 'strength-very-strong' };
    if (score >= 60) return { color: '#66bb6a', bg: 'rgba(102,187,106,0.15)', label: 'Strong', class: 'strength-strong' };
    if (score >= 40) return { color: '#ffa726', bg: 'rgba(255,167,38,0.15)', label: 'Moderate', class: 'strength-moderate' };
    return { color: '#ff4444', bg: 'rgba(255,68,68,0.15)', label: 'Weak', class: 'strength-weak' };
}

/**
 * Quick client-side strength estimate for real-time feedback
 * @param {string} password
 * @returns {number} Quick score estimate (0-100)
 */
export function quickStrengthScore(password) {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score += 15;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 5;
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;
    const unique = new Set(password).size;
    if (unique / password.length >= 0.7) score += 10;
    return Math.min(100, score);
}

/**
 * Format large numbers with suffixes
 */
export function formatNumber(num) {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
}

/**
 * Generate character set for brute force simulation display
 */
export function getCharacterPool() {
    return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
}
