/**
 * StrengthMeter – Premium strength analysis dashboard
 * Fixed: guessesPerSecond display, refined layout hierarchy
 */

import { motion } from 'framer-motion';
import { getStrengthColor } from '../utils/passwordUtils';

export default function StrengthMeter({ analysis }) {
    if (!analysis) return null;

    const { score, label, entropy, charsetSize, checks, suggestions, crackTime } = analysis;
    const strengthInfo = getStrengthColor(score);

    const criteria = [
        { label: 'Lowercase (a-z)', passed: checks?.lowercase },
        { label: 'Uppercase (A-Z)', passed: checks?.uppercase },
        { label: 'Numbers (0-9)', passed: checks?.numbers },
        { label: 'Symbols (!@#)', passed: checks?.special },
        { label: 'Length ≥ 12', passed: (checks?.length || 0) >= 12 },
        { label: 'Not common', passed: !checks?.isCommon },
        { label: 'No sequences', passed: !checks?.sequential },
        { label: 'No repeats', passed: !checks?.repeated },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-7 sm:p-8 h-full"
        >
            {/* ─── Header ──────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: `${strengthInfo.color}12`,
                            border: `1px solid ${strengthInfo.color}20`,
                        }}>
                        <span className="text-lg">📊</span>
                    </div>
                    <div>
                        <h3 className="font-display text-sm font-bold tracking-[2px] text-white">
                            ANALYSIS
                        </h3>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Comprehensive breakdown</p>
                    </div>
                </div>
                <div className={`cyber-badge ${score >= 60 ? 'cyber-badge-cyan' : 'cyber-badge-pink'}`}>
                    {label}
                </div>
            </div>

            {/* ─── Score Ring + Stats ────────────── */}
            <div className="flex items-center gap-6 mb-6">
                {/* Circle */}
                <div className="relative shrink-0">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                        <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="7" />
                        <circle cx="70" cy="70" r="50" fill="none" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
                        <motion.circle
                            cx="70" cy="70" r="58" fill="none"
                            stroke={strengthInfo.color}
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 58}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - score / 100) }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            transform="rotate(-90 70 70)"
                            style={{ filter: `drop-shadow(0 0 10px ${strengthInfo.color}50)` }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            className="font-display text-4xl font-black leading-none"
                            style={{ color: strengthInfo.color }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                        >
                            {score}
                        </motion.span>
                        <span className="text-[8px] tracking-[2px] uppercase mt-1" style={{ color: 'var(--text-muted)' }}>
                            / 100
                        </span>
                    </div>
                </div>

                {/* Stat Boxes */}
                <div className="flex-1 space-y-2.5">
                    <div className="stat-box py-3 px-4">
                        <p className="text-[9px] tracking-[1.5px] uppercase" style={{ color: 'var(--text-muted)' }}>Entropy</p>
                        <p className="font-display text-lg font-bold" style={{ color: '#00f5d4' }}>
                            {entropy} <span className="text-[9px] font-normal" style={{ color: 'var(--text-muted)' }}>bits</span>
                        </p>
                    </div>
                    <div className="stat-box py-3 px-4">
                        <p className="text-[9px] tracking-[1.5px] uppercase" style={{ color: 'var(--text-muted)' }}>Charset Pool</p>
                        <p className="font-display text-lg font-bold" style={{ color: '#7b2ff7' }}>
                            {charsetSize} <span className="text-[9px] font-normal" style={{ color: 'var(--text-muted)' }}>chars</span>
                        </p>
                    </div>
                    <div className="stat-box py-3 px-4">
                        <p className="text-[9px] tracking-[1.5px] uppercase" style={{ color: 'var(--text-muted)' }}>Length</p>
                        <p className="font-display text-lg font-bold" style={{ color: '#f72585' }}>
                            {checks?.length || 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Crack Time ───────────────────── */}
            {crackTime && (
                <div className="p-4 rounded-xl mb-6"
                    style={{ background: 'rgba(247, 37, 133, 0.04)', border: '1px solid rgba(247, 37, 133, 0.1)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm">⏱️</span>
                        <span className="text-[9px] tracking-[2px] uppercase font-semibold" style={{ color: 'rgba(247,37,133,0.7)' }}>
                            Crack Time
                        </span>
                    </div>
                    <p className="font-display text-xl font-bold mb-1" style={{ color: '#f72585' }}>
                        {crackTime.formatted}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        @ 10 billion guesses/sec
                    </p>
                </div>
            )}

            {/* ─── Criteria Grid ───────────────── */}
            <div className="mb-5">
                <h4 className="text-[9px] tracking-[2px] uppercase font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Security Criteria
                </h4>
                <div className="grid grid-cols-2 gap-1.5">
                    {criteria.map((item, i) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.04 }}
                            className="flex items-center gap-2.5 p-2.5 rounded-lg"
                            style={{
                                background: item.passed ? 'rgba(0,245,212,0.03)' : 'rgba(255,23,68,0.03)',
                                border: `1px solid ${item.passed ? 'rgba(0,245,212,0.08)' : 'rgba(255,23,68,0.08)'}`,
                            }}
                        >
                            <span className="text-[10px] shrink-0"
                                style={{ color: item.passed ? '#00f5d4' : '#ff1744' }}>
                                {item.passed ? '✓' : '✗'}
                            </span>
                            <span className="text-[11px]" style={{ color: item.passed ? 'rgba(0,245,212,0.75)' : 'rgba(255,23,68,0.65)' }}>
                                {item.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ─── Suggestions ─────────────────── */}
            {suggestions?.length > 0 && (
                <div>
                    <h4 className="text-[9px] tracking-[2px] uppercase font-semibold mb-2.5" style={{ color: 'var(--text-secondary)' }}>
                        Recommendations
                    </h4>
                    <div className="space-y-1.5">
                        {suggestions.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.06 }}
                                className="flex items-start gap-2.5 p-3 rounded-lg"
                                style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}
                            >
                                <span className="text-[10px] mt-0.5 shrink-0" style={{ color: '#ffc107' }}>▸</span>
                                <span className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
