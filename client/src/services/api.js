/**
 * API Service
 * 
 * Centralized API client for communicating with the SecurePass backend.
 * All password data is sent over HTTPS and never cached.
 */

import axios from 'axios';

// In production, set VITE_API_URL to your backend URL (e.g. https://securepass-api.onrender.com/api/password)
// In development, the Vite proxy handles forwarding /api to localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || '/api/password';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Analyze password strength
 * @param {string} password
 * @returns {Promise<Object>} Strength analysis results
 */
export async function analyzePassword(password) {
    const { data } = await api.post('/analyze', { password });
    return data;
}

/**
 * Check if password has been found in data breaches
 * @param {string} password
 * @returns {Promise<Object>} Breach check results
 */
export async function checkBreach(password) {
    const { data } = await api.post('/breach', { password });
    return data;
}

/**
 * Generate bcrypt hash of password
 * @param {string} password
 * @param {number} rounds - Salt rounds (4-14)
 * @returns {Promise<Object>} Hash result
 */
export async function hashPassword(password, rounds = 10) {
    const { data } = await api.post('/hash', { password, rounds });
    return data;
}

/**
 * Compare password against a bcrypt hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<Object>} Comparison result
 */
export async function compareHash(password, hash) {
    const { data } = await api.post('/compare', { password, hash });
    return data;
}

/**
 * Demonstrate salt uniqueness
 * @param {string} password
 * @returns {Promise<Object>} Two different hashes from same password
 */
export async function saltDemo(password) {
    const { data } = await api.post('/salt-demo', { password });
    return data;
}

/**
 * Generate a strong random password
 * @param {number} length - Desired length (8-64)
 * @returns {Promise<Object>} Generated password and analysis
 */
export async function generatePassword(length = 16) {
    const { data } = await api.post('/generate', { length });
    return data;
}

export default api;
