/**
 * PasswordInput – Unified premium password entry bar
 * Adapts its appearance and behavior based on the active tab
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quickStrengthScore, getStrengthColor, copyToClipboard } from '../utils/passwordUtils';
import { generatePassword } from '../services/api';

const TAB_CONFIG = {
    analyzer: { accent: '#00f5d4', placeholder: 'Enter your password to analyze...', icon: '◈' },
    breach: { accent: '#f72585', placeholder: 'Enter password to scan for breaches...', icon: '⬡' },
    bruteforce: { accent: '#ff6b35', placeholder: 'Enter a short password for simulation (≤10 chars)...', icon: '⟁' },
    hashing: { accent: '#7b2ff7', placeholder: 'Enter password for hashing demo...', icon: '⬢' },
};

export default function PasswordInput({ password, setPassword, onAnalyze, activeTab = 'analyzer' }) {
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [focused, setFocused] = useState(false);
    const [genError, setGenError] = useState(null);

    const config = TAB_CONFIG[activeTab] || TAB_CONFIG.analyzer;
    const quickScore = quickStrengthScore(password);
    const strengthInfo = getStrengthColor(quickScore);

    const handleCopy = useCallback(async () => {
        if (!password) return;
        await copyToClipboard(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [password]);

    const handleGenerate = useCallback(async () => {
        setGenerating(true);
        setGenError(null);
        try {
            const result = await generatePassword(20);
            setPassword(result.password);
        } catch (err) {
            setGenError('Generation failed — is the server running?');
            setTimeout(() => setGenError(null), 3000);
        }
        setGenerating(false);
    }, [setPassword]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && password && activeTab === 'analyzer') {
            onAnalyze();
        }
    };

    return (
        <div className="glass-card p-5 sm:p-7" style={{ borderColor: focused ? `${config.accent}20` : undefined }}>
            {/* ─── Copy Toast Notification ──── */}
            <AnimatePresence>
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: -40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        style={{
                            position: 'fixed',
                            top: '28px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 22px',
                            borderRadius: '14px',
                            background: 'rgba(10, 14, 20, 0.85)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            border: '1px solid rgba(0, 245, 212, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 245, 212, 0.08)',
                        }}
                    >
                        <motion.span
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                background: 'rgba(0, 245, 212, 0.12)',
                                border: '1px solid rgba(0, 245, 212, 0.25)',
                                fontSize: '13px',
                            }}
                        >
                            ✓
                        </motion.span>
                        <div>
                            <p style={{
                                margin: 0,
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#00f5d4',
                                letterSpacing: '0.3px',
                            }}>
                                Copied to clipboard
                            </p>
                            <p style={{
                                margin: 0,
                                marginTop: '2px',
                                fontSize: '10px',
                                color: 'rgba(255, 255, 255, 0.4)',
                                letterSpacing: '0.5px',
                            }}>
                                Password ready to paste
                            </p>
                        </div>
                        {/* Animated progress bar */}
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: 2, ease: 'linear' }}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '14px',
                                right: '14px',
                                height: '2px',
                                borderRadius: '1px',
                                background: 'rgba(0, 245, 212, 0.4)',
                                transformOrigin: 'left',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Top Row: Input + Controls ──── */}
            <div className="flex items-center gap-3">
                {/* Tab-colored icon */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{
                        background: `${config.accent}10`,
                        border: `1px solid ${config.accent}20`,
                    }}>
                    <span className="text-base sm:text-lg" style={{ color: config.accent }}>{config.icon}</span>
                </div>

                {/* Input Field */}
                <div className="relative flex-1 group">
                    {/* Focus glow */}
                    <AnimatePresence>
                        {focused && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute -inset-0.5 rounded-2xl pointer-events-none"
                                style={{
                                    background: `linear-gradient(135deg, ${config.accent}08, transparent)`,
                                    filter: 'blur(6px)',
                                }}
                            />
                        )}
                    </AnimatePresence>

                    <input
                        id="password-input"
                        type={visible ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={config.placeholder}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        data-lpignore="true"
                        maxLength={activeTab === 'bruteforce' ? 10 : 128}
                        className="password-input relative z-10"
                        style={{ paddingRight: '90px', borderColor: focused ? `${config.accent}30` : undefined }}
                    />

                    {/* Controls inside input */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center gap-0.5">
                        <button
                            onClick={() => setVisible(!visible)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/5 text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                            title={visible ? 'Hide password' : 'Show password'}
                            type="button"
                        >
                            {visible ? '👁️' : '🙈'}
                        </button>
                        <button
                            onClick={handleCopy}
                            disabled={!password}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/5 disabled:opacity-20 text-sm"
                            title="Copy to clipboard"
                            type="button"
                        >
                            {copied ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xs">✅</motion.span> : '📋'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Strength Bar (shows when password present) ── */}
            <AnimatePresence>
                {password && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Bar header */}
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] tracking-[2px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                                    Strength
                                </span>
                                <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                    {password.length} chars
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold" style={{ color: strengthInfo.color }}>
                                    {strengthInfo.label}
                                </span>
                                <span className="font-display text-[11px] font-bold" style={{ color: strengthInfo.color }}>
                                    {quickScore}%
                                </span>
                            </div>
                        </div>

                        {/* Segmented bar */}
                        <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((seg) => {
                                const threshold = (seg + 1) * 20;
                                const filled = quickScore >= threshold;
                                const partial = quickScore > seg * 20 && quickScore < threshold;
                                const width = filled ? '100%' : partial ? `${((quickScore - seg * 20) / 20) * 100}%` : '0%';
                                return (
                                    <div key={seg} className="flex-1 h-1.5 rounded-full overflow-hidden"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                                        <motion.div
                                            className="h-full rounded-full"
                                            animate={{ width }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                background: strengthInfo.color,
                                                boxShadow: `0 0 6px ${strengthInfo.color}30`,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Character type badges */}
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-1.5">
                                {[
                                    { test: /[a-z]/, label: 'a-z' },
                                    { test: /[A-Z]/, label: 'A-Z' },
                                    { test: /[0-9]/, label: '0-9' },
                                    { test: /[^a-zA-Z0-9]/, label: '!@#' },
                                ].map(({ test, label }) => {
                                    const active = test.test(password);
                                    return (
                                        <span key={label}
                                            className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-all"
                                            style={{
                                                background: active ? `${config.accent}10` : 'rgba(255,255,255,0.02)',
                                                color: active ? config.accent : 'var(--text-muted)',
                                                border: `1px solid ${active ? `${config.accent}20` : 'transparent'}`,
                                            }}>
                                            {label}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Generate button (inline, small) */}
                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-lg transition-all hover:scale-105 disabled:opacity-40"
                                style={{
                                    background: 'rgba(0,245,212,0.06)',
                                    border: '1px solid rgba(0,245,212,0.12)',
                                    color: '#00f5d4',
                                }}
                                type="button"
                            >
                                {generating ? '⟳' : '⟐'} Generate
                            </button>
                        </div>

                        {/* Gen error */}
                        <AnimatePresence>
                            {genError && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] mt-1.5"
                                    style={{ color: '#ff5252' }}
                                >
                                    {genError}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Analyze Button (only on analyzer tab) ── */}
            {activeTab === 'analyzer' && (
                <div className="mt-4">
                    <motion.button
                        onClick={onAnalyze}
                        disabled={!password}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full btn-primary py-3.5 disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                        ◈ Deep Analysis
                    </motion.button>
                </div>
            )}

            {/* ─── Security Info Line ──────────── */}
            <div className="flex items-center gap-2 mt-4 pl-1">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Your password is <strong style={{ color: 'rgba(0,245,212,0.6)' }}>never stored</strong> or logged.
                    Breach checks use k-anonymity — only a partial hash prefix is sent.
                </p>
            </div>
        </div>
    );
}
