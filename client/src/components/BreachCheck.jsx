/**
 * BreachCheck – Premium breach scanner with k-anonymity
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkBreach } from '../services/api';

export default function BreachCheck({ password, onBreachResult }) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheck = async () => {
        if (!password) return;
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await checkBreach(password);
            setResult(data);
            // Pass result up to App for SecurityReport PDF
            if (onBreachResult) onBreachResult(data);
        } catch (err) {
            setError('Unable to reach breach database. Please try again.');
        }
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
        >
            {/* ─── Main Card ───────────────────── */}
            <div className="glass-card p-7 sm:p-9">
                {/* Header */}
                <div className="flex items-center justify-between mb-7">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(247,37,133,0.12), rgba(181,23,158,0.08))',
                                border: '1px solid rgba(247,37,133,0.15)',
                            }}>
                            <span className="text-2xl">🛡️</span>
                        </div>
                        <div>
                            <h3 className="font-display text-base font-bold tracking-[2px] text-white">
                                BREACH SCAN
                            </h3>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                HaveIBeenPwned k-anonymity check
                            </p>
                        </div>
                    </div>
                    <div className="cyber-badge cyber-badge-pink">HIBP v3</div>
                </div>

                {/* k-Anonymity Explanation */}
                <div className="p-5 rounded-xl mb-7 relative overflow-hidden"
                    style={{ background: 'rgba(5,5,16,0.5)', border: '1px solid rgba(0,245,212,0.06)' }}>
                    <h4 className="font-display text-[11px] tracking-[2px] font-bold mb-4"
                        style={{ color: 'rgba(0,245,212,0.8)' }}>
                        HOW K-ANONYMITY PROTECTS YOU
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { step: '01', text: 'SHA-1 hash your password locally on your device', color: '#00f5d4', icon: '🔐' },
                            { step: '02', text: 'Send only first 5 hash characters to HIBP API', color: '#00b4d8', icon: '📤' },
                            { step: '03', text: 'Receive all matching hash suffixes from database', color: '#7b2ff7', icon: '📥' },
                            { step: '04', text: 'Compare locally — full hash never leaves device', color: '#f72585', icon: '✅' },
                        ].map((item) => (
                            <div key={item.step}
                                className="flex items-start gap-3 p-3 rounded-lg transition-all"
                                style={{ background: `${item.color}05`, border: `1px solid ${item.color}10` }}>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-display text-[10px] font-black" style={{ color: item.color }}>
                                        {item.step}
                                    </span>
                                    <span className="text-sm">{item.icon}</span>
                                </div>
                                <span className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {item.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scan Button */}
                <motion.button
                    onClick={handleCheck}
                    disabled={!password || loading}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full mb-2 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-sm tracking-[1.5px] uppercase transition-all"
                    style={{
                        background: loading
                            ? 'rgba(247,37,133,0.15)'
                            : 'linear-gradient(135deg, #f72585, #b5179e)',
                        color: loading ? '#f72585' : 'white',
                        border: loading ? '1px solid rgba(247,37,133,0.3)' : 'none',
                        boxShadow: loading ? 'none' : '0 4px 20px rgba(247,37,133,0.25)',
                    }}
                >
                    {loading ? (
                        <>
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="inline-block text-base"
                            >⟳</motion.span>
                            Scanning breach databases...
                        </>
                    ) : (
                        <>◈ Initiate Breach Scan</>
                    )}
                </motion.button>

                {!password && (
                    <p className="text-[10px] text-center mt-2" style={{ color: 'var(--text-muted)' }}>
                        Enter a password above to scan
                    </p>
                )}
            </div>

            {/* ─── Error ───────────────────────── */}
            {error && (
                <div className="glass-card p-5">
                    <div className="flex items-center gap-3">
                        <span className="text-lg">⚠️</span>
                        <p className="text-[12px]" style={{ color: '#ff5252' }}>{error}</p>
                    </div>
                </div>
            )}

            {/* ─── Results ─────────────────────── */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="glass-card p-8 sm:p-10"
                        style={{
                            borderColor: result.found ? 'rgba(255,23,68,0.2)' : 'rgba(0,245,212,0.2)',
                        }}
                    >
                        {/* Status Icon */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
                                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-5"
                                style={{
                                    background: result.found ? 'rgba(255,23,68,0.08)' : 'rgba(0,245,212,0.08)',
                                    border: `2px solid ${result.found ? 'rgba(255,23,68,0.25)' : 'rgba(0,245,212,0.25)'}`,
                                    boxShadow: `0 0 50px ${result.found ? 'rgba(255,23,68,0.12)' : 'rgba(0,245,212,0.12)'}`,
                                }}
                            >
                                <span className="text-5xl">{result.found ? '🚨' : '🛡️'}</span>
                            </motion.div>

                            <h4 className="font-display text-2xl font-black tracking-[4px] mb-2"
                                style={{ color: result.found ? '#ff1744' : '#00f5d4' }}>
                                {result.found ? 'COMPROMISED' : 'SECURE'}
                            </h4>
                            <p className="text-[12px] max-w-md mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                {result.message}
                            </p>
                        </div>

                        {/* Breach Count */}
                        {result.found && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="p-6 rounded-xl text-center mb-6"
                                style={{ background: 'rgba(255,23,68,0.05)', border: '1px solid rgba(255,23,68,0.12)' }}
                            >
                                <p className="text-[10px] tracking-[3px] uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
                                    Appearances in breaches
                                </p>
                                <p className="font-display text-5xl font-black leading-none" style={{ color: '#ff1744' }}>
                                    {result.count?.toLocaleString()}
                                </p>
                                <p className="text-[11px] mt-3 font-semibold" style={{ color: '#ff5252' }}>
                                    ⚠ Change this password immediately on all accounts
                                </p>
                            </motion.div>
                        )}

                        {/* Hash Details */}
                        {result.prefix && (
                            <div className="p-4 rounded-xl space-y-2"
                                style={{ background: 'rgba(5,5,16,0.5)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <div className="flex items-center gap-3 text-[11px]">
                                    <span className="text-[9px] tracking-[1px] uppercase w-20 shrink-0" style={{ color: 'var(--text-muted)' }}>
                                        SHA-1 prefix
                                    </span>
                                    <code className="font-mono font-bold" style={{ color: '#00f5d4' }}>{result.prefix}</code>
                                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>← only this was sent</span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px]">
                                    <span className="text-[9px] tracking-[1px] uppercase w-20 shrink-0" style={{ color: 'var(--text-muted)' }}>
                                        Full hash
                                    </span>
                                    <code className="font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>{result.hashPreview}</code>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
