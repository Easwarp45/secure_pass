/**
 * HashingDemo – Premium interactive hashing lab
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hashPassword, compareHash, saltDemo } from '../services/api';

export default function HashingDemo({ password }) {
    const [activeTab, setActiveTab] = useState('generate');
    const [hashResult, setHashResult] = useState(null);
    const [compareResult, setCompareResult] = useState(null);
    const [saltResult, setSaltResult] = useState(null);
    const [compareHash2, setCompareHash2] = useState('');
    const [rounds, setRounds] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleGenerateHash = async () => {
        if (!password) return;
        setLoading(true);
        try { setHashResult(await hashPassword(password, rounds)); } catch { }
        setLoading(false);
    };

    const handleCompare = async () => {
        if (!password || !compareHash2) return;
        setLoading(true);
        try { setCompareResult(await compareHash(password, compareHash2)); } catch { }
        setLoading(false);
    };

    const handleSaltDemo = async () => {
        if (!password) return;
        setLoading(true);
        try { setSaltResult(await saltDemo(password)); } catch { }
        setLoading(false);
    };

    const tabs = [
        { id: 'generate', label: 'GENERATE', icon: '⬢', color: '#00f5d4' },
        { id: 'compare', label: 'COMPARE', icon: '⬡', color: '#7b2ff7' },
        { id: 'salt', label: 'SALT DEMO', icon: '◇', color: '#f72585' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-7 sm:p-9"
        >
            {/* ─── Header ──────────────────────── */}
            <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(123,47,247,0.12), rgba(0,180,216,0.08))',
                            border: '1px solid rgba(123,47,247,0.15)',
                        }}>
                        <span className="text-2xl">⬢</span>
                    </div>
                    <div>
                        <h3 className="font-display text-base font-bold tracking-[2px] text-white">
                            HASH LAB
                        </h3>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Explore bcrypt hashing & salting</p>
                    </div>
                </div>
                <div className="cyber-badge cyber-badge-purple">
                    bcrypt
                </div>
            </div>

            {/* ─── Sub-Tabs ────────────────────── */}
            <div className="flex gap-1.5 p-1.5 rounded-xl mb-7"
                style={{ background: 'rgba(5,5,16,0.6)', border: '1px solid rgba(255,255,255,0.03)' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-semibold tracking-[1px] transition-all"
                        style={{
                            background: activeTab === tab.id ? `${tab.color}10` : 'transparent',
                            color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
                            border: `1px solid ${activeTab === tab.id ? `${tab.color}25` : 'transparent'}`,
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ─── Tab Content ─────────────────── */}
            <AnimatePresence mode="wait">
                {/* ═══ GENERATE ═══ */}
                {activeTab === 'generate' && (
                    <motion.div
                        key="generate"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Rounds Selector */}
                        <div className="mb-5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] tracking-[2px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                                    Salt Rounds
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="font-display text-sm font-bold" style={{ color: '#00f5d4' }}>{rounds}</span>
                                    <span className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                        ({Math.pow(2, rounds).toLocaleString()} iter.)
                                    </span>
                                </div>
                            </div>
                            <input type="range" min="4" max="14" value={rounds}
                                onChange={(e) => setRounds(parseInt(e.target.value))}
                                className="w-full" style={{ accentColor: '#00f5d4' }}
                            />
                            <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
                                <span>⚡ Fast (4)</span>
                                <span>Secure (14) 🔒</span>
                            </div>
                        </div>

                        <motion.button
                            onClick={handleGenerateHash}
                            disabled={!password || loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full btn-primary mb-5 disabled:opacity-30"
                        >
                            {loading ? '⟳ Hashing...' : '⬢ GENERATE BCRYPT HASH'}
                        </motion.button>

                        {hashResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                            >
                                {/* Hash output in terminal style */}
                                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div className="px-4 py-2" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <span className="text-[10px] tracking-[1px] font-semibold" style={{ color: 'var(--text-muted)' }}>OUTPUT</span>
                                    </div>
                                    <div className="p-4 space-y-3" style={{ background: 'rgba(0,0,0,0.4)' }}>
                                        <div>
                                            <p className="text-[9px] font-mono uppercase mb-1" style={{ color: 'rgba(0,245,212,0.5)' }}>hash:</p>
                                            <code className="text-[12px] font-mono break-all leading-relaxed" style={{ color: '#00f5d4' }}>
                                                {hashResult.hash}
                                            </code>
                                        </div>
                                        <div className="neon-line" />
                                        <div>
                                            <p className="text-[9px] font-mono uppercase mb-1" style={{ color: 'rgba(123,47,247,0.5)' }}>salt:</p>
                                            <code className="text-[12px] font-mono break-all" style={{ color: '#7b2ff7' }}>
                                                {hashResult.salt}
                                            </code>
                                        </div>
                                        <div className="neon-line" />
                                        <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                            ⏱ Generated in <span style={{ color: '#ff6b35' }}>{hashResult.durationMs}ms</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Explanation */}
                                <div className="p-4 rounded-xl" style={{ background: 'rgba(0,245,212,0.02)', border: '1px solid rgba(0,245,212,0.06)' }}>
                                    <h4 className="text-[10px] tracking-[2px] uppercase font-semibold mb-2" style={{ color: 'rgba(0,245,212,0.6)' }}>
                                        How it works
                                    </h4>
                                    {hashResult.explanation?.map((line, i) => (
                                        <p key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{line}</p>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* ═══ COMPARE ═══ */}
                {activeTab === 'compare' && (
                    <motion.div
                        key="compare"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="mb-4">
                            <label className="text-[10px] tracking-[2px] uppercase font-semibold block mb-2" style={{ color: 'var(--text-muted)' }}>
                                Bcrypt Hash
                            </label>
                            <input type="text" value={compareHash2}
                                onChange={(e) => setCompareHash2(e.target.value)}
                                placeholder="$2a$10$..."
                                className="password-input text-sm"
                            />
                            <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                                Generate a hash above, then paste it here to verify
                            </p>
                        </div>

                        <motion.button
                            onClick={handleCompare}
                            disabled={!password || !compareHash2 || loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full btn-primary mb-5 disabled:opacity-30"
                        >
                            {loading ? '⟳ Comparing...' : '⬡ VERIFY HASH'}
                        </motion.button>

                        {compareResult && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-7 rounded-xl text-center"
                                style={{
                                    background: compareResult.isMatch ? 'rgba(0,245,212,0.04)' : 'rgba(255,23,68,0.04)',
                                    border: `1px solid ${compareResult.isMatch ? 'rgba(0,245,212,0.15)' : 'rgba(255,23,68,0.15)'}`,
                                }}
                            >
                                <div className="text-5xl mb-3">{compareResult.isMatch ? '✅' : '❌'}</div>
                                <h4 className={`font-display text-lg font-bold tracking-[2px] ${compareResult.isMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {compareResult.isMatch ? 'MATCH CONFIRMED' : 'NO MATCH'}
                                </h4>
                                <p className="text-[11px] mt-2 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                                    {compareResult.explanation}
                                </p>
                                <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                                    Verified in {compareResult.durationMs}ms
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* ═══ SALT DEMO ═══ */}
                {activeTab === 'salt' && (
                    <motion.div
                        key="salt"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="p-5 rounded-xl mb-5"
                            style={{ background: 'rgba(247,37,133,0.03)', border: '1px solid rgba(247,37,133,0.1)' }}>
                            <h4 className="font-display text-[11px] tracking-[2px] font-bold mb-2" style={{ color: 'rgba(247,37,133,0.8)' }}>
                                WHAT IS SALTING?
                            </h4>
                            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                A salt is a unique random value added before hashing. This ensures identical passwords
                                produce completely different hashes, defeating rainbow table attacks.
                            </p>
                        </div>

                        <motion.button
                            onClick={handleSaltDemo}
                            disabled={!password || loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full btn-primary mb-5 disabled:opacity-30"
                        >
                            {loading ? '⟳ Generating...' : '◇ GENERATE TWO HASHES'}
                        </motion.button>

                        {saltResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {/* Hash comparison */}
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,245,212,0.08)' }}>
                                        <p className="text-[9px] font-mono uppercase mb-1.5" style={{ color: 'rgba(0,245,212,0.5)' }}>hash #1</p>
                                        <code className="text-[11px] font-mono break-all" style={{ color: '#00f5d4' }}>{saltResult.hash1}</code>
                                    </div>
                                    <div className="text-center py-1">
                                        <span className="text-lg" style={{ color: 'var(--text-muted)' }}>≠</span>
                                    </div>
                                    <div className="p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(123,47,247,0.08)' }}>
                                        <p className="text-[9px] font-mono uppercase mb-1.5" style={{ color: 'rgba(123,47,247,0.5)' }}>hash #2</p>
                                        <code className="text-[11px] font-mono break-all" style={{ color: '#7b2ff7' }}>{saltResult.hash2}</code>
                                    </div>
                                </div>

                                {/* Result */}
                                <div className="p-5 rounded-xl text-center" style={{ background: 'rgba(255,107,53,0.04)', border: '1px solid rgba(255,107,53,0.1)' }}>
                                    <p className="font-display text-base font-bold tracking-[2px]" style={{ color: '#ff6b35' }}>
                                        {saltResult.areDifferent ? 'SAME PASSWORD → DIFFERENT HASHES' : 'IDENTICAL'}
                                    </p>
                                    <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                                        Each hash uses a unique random salt
                                    </p>
                                </div>

                                {/* Explanation */}
                                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
                                    {saltResult.explanation?.map((line, i) => (
                                        <p key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                            {line || '\u00A0'}
                                        </p>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
