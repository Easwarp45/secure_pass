/**
 * BruteForceSimulation – Cyberpunk attack simulator
 * Fixed: resets when password changes, stops cleanly, improved layout
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

export default function BruteForceSimulation({ password }) {
    const [running, setRunning] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [guessedChars, setGuessedChars] = useState([]);
    const [speed, setSpeed] = useState(50);
    const intervalRef = useRef(null);
    const attemptsRef = useRef(0);

    const target = (password || '').slice(0, 10) || 'demo';

    // Clear simulation when password changes
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        setCompleted(false);
        setAttempts(0);
        setCurrentGuess('');
        setGuessedChars([]);
        attemptsRef.current = 0;
    }, [password]);

    // Cleanup on unmount
    useEffect(() => {
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    const startSimulation = useCallback(() => {
        if (!target) return;

        // Reset state
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(true);
        setCompleted(false);
        setAttempts(0);
        setGuessedChars([]);
        attemptsRef.current = 0;

        let charIndex = 0;
        let cycleCount = 0;
        const maxCycles = 25 + Math.floor(Math.random() * 35);

        intervalRef.current = setInterval(() => {
            if (charIndex >= target.length) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setCurrentGuess(target);
                setCompleted(true);
                setRunning(false);
                return;
            }

            attemptsRef.current += 1;
            setAttempts(attemptsRef.current);
            cycleCount++;

            if (cycleCount >= maxCycles) {
                setGuessedChars(prev => [...prev, target[charIndex]]);
                charIndex++;
                cycleCount = 0;
            }

            let guess = '';
            for (let i = 0; i < target.length; i++) {
                if (i < charIndex) guess += target[i];
                else guess += CHARSET[Math.floor(Math.random() * CHARSET.length)];
            }
            setCurrentGuess(guess);
        }, speed);
    }, [target, speed]);

    const stopSimulation = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setRunning(false);
    }, []);

    const resetSimulation = useCallback(() => {
        stopSimulation();
        setCompleted(false);
        setAttempts(0);
        setCurrentGuess('');
        setGuessedChars([]);
        attemptsRef.current = 0;
    }, [stopSimulation]);

    const progress = target ? (guessedChars.length / target.length) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-7 sm:p-9"
        >
            {/* ─── Header ──────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,145,0,0.08))',
                            border: '1px solid rgba(255,107,53,0.15)',
                        }}>
                        <span className="text-2xl">⟁</span>
                    </div>
                    <div>
                        <h3 className="font-display text-base font-bold tracking-[2px] text-white">
                            ATTACK SIM
                        </h3>
                        <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                            Brute-force visualization · {target.length} chars
                        </p>
                    </div>
                </div>
                <div className="cyber-badge cyber-badge-orange">Educational</div>
            </div>

            {/* ─── Warning ─────────────────────── */}
            <div className="p-4 rounded-xl mb-6"
                style={{ background: 'rgba(255,107,53,0.04)', border: '1px solid rgba(255,107,53,0.1)' }}>
                <p className="text-[11px]" style={{ color: 'rgba(255,107,53,0.8)' }}>
                    <strong>⚠ Educational simulation only.</strong> Real attacks operate at 10+ billion guesses/sec.
                    This is a simplified character-by-character visualization.
                </p>
            </div>

            {/* ─── Controls Bar ────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Speed Slider */}
                <div className="p-4 rounded-xl" style={{ background: 'rgba(5,5,16,0.5)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] tracking-[2px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>
                            Speed
                        </span>
                        <span className="font-mono text-[11px]" style={{ color: '#ff6b35' }}>{speed}ms</span>
                    </div>
                    <input
                        type="range" min="10" max="200" value={speed}
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                        disabled={running}
                        className="w-full"
                        style={{ accentColor: '#ff6b35' }}
                    />
                    <div className="flex justify-between text-[9px] mt-1" style={{ color: 'var(--text-muted)' }}>
                        <span>⚡ Fast</span><span>Slow 🐌</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                    {!running ? (
                        <motion.button
                            onClick={startSimulation}
                            disabled={!password}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary flex-1 disabled:opacity-30 text-sm"
                        >
                            {completed ? '⟳ RERUN ATTACK' : '▶ EXECUTE ATTACK'}
                        </motion.button>
                    ) : (
                        <motion.button
                            onClick={stopSimulation}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 rounded-xl font-bold text-sm tracking-wider uppercase py-3"
                            style={{
                                background: 'linear-gradient(135deg, #f72585, #b5179e)',
                                color: 'white',
                            }}
                        >
                            ■ TERMINATE
                        </motion.button>
                    )}
                    <motion.button
                        onClick={resetSimulation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-secondary py-2.5 text-sm"
                    >
                        ⟲ RESET
                    </motion.button>
                </div>
            </div>

            {/* ─── Terminal Display ─────────────── */}
            <div className="rounded-xl mb-6 overflow-hidden"
                style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-2.5"
                    style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
                    </div>
                    <span className="text-[10px] font-mono ml-2" style={{ color: 'var(--text-muted)' }}>
                        brute_force.exe — {running ? '● running' : completed ? '✓ completed' : '○ ready'}
                    </span>
                </div>

                <div className="p-5 space-y-5">
                    {/* Target */}
                    <div>
                        <p className="text-[10px] font-mono mb-2" style={{ color: 'rgba(0,245,212,0.5)' }}>
                            {'>'} target_password:
                        </p>
                        <div className="flex gap-1.5 flex-wrap">
                            {target.split('').map((char, i) => (
                                <motion.div
                                    key={`target-${i}`}
                                    className="w-9 h-11 rounded-lg flex items-center justify-center font-mono text-sm font-bold"
                                    animate={{
                                        borderColor: guessedChars[i] ? '#00f5d4' : 'rgba(255,255,255,0.06)',
                                        background: guessedChars[i] ? 'rgba(0,245,212,0.1)' : 'rgba(255,255,255,0.02)',
                                    }}
                                    style={{
                                        border: '1.5px solid',
                                        color: guessedChars[i] ? '#00f5d4' : 'rgba(255,255,255,0.15)',
                                        boxShadow: guessedChars[i] ? '0 0 12px rgba(0,245,212,0.2)' : 'none',
                                    }}
                                >
                                    {guessedChars[i] || '•'}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Current Guess */}
                    <AnimatePresence>
                        {(running || currentGuess) && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <p className="text-[10px] font-mono mb-2" style={{ color: 'rgba(247,37,133,0.5)' }}>
                                    {'>'} current_attempt:
                                </p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {currentGuess.split('').map((char, i) => {
                                        const isCorrect = i < guessedChars.length;
                                        return (
                                            <div
                                                key={`guess-${i}-${char}`}
                                                className="w-9 h-11 rounded-lg flex items-center justify-center font-mono text-sm font-bold transition-colors duration-75"
                                                style={{
                                                    background: isCorrect ? 'rgba(0,245,212,0.06)' : 'rgba(247,37,133,0.04)',
                                                    border: `1.5px solid ${isCorrect ? 'rgba(0,245,212,0.2)' : 'rgba(247,37,133,0.15)'}`,
                                                    color: isCorrect ? '#00f5d4' : '#f72585',
                                                }}
                                            >
                                                {char}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Stats */}
                    <div className="flex gap-6 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                            <p className="text-[9px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>attempts</p>
                            <p className="font-display text-xl font-bold text-white">{attempts.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>cracked</p>
                            <p className="font-display text-xl font-bold" style={{ color: '#00f5d4' }}>
                                {guessedChars.length}<span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/{target.length}</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-[9px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>status</p>
                            <p className="text-sm font-bold" style={{ color: running ? '#ff6b35' : completed ? '#00f5d4' : 'var(--text-muted)' }}>
                                {running ? '● RUNNING' : completed ? '✓ DONE' : '○ IDLE'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Progress Bar ────────────────── */}
            <div className="mb-3">
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #ff6b35, #f72585, #00f5d4)' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="flex justify-between mt-1.5">
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Progress</span>
                    <span className="text-[10px] font-mono" style={{ color: '#ff6b35' }}>{Math.round(progress)}%</span>
                </div>
            </div>

            {/* ─── Completed Banner ─────────────── */}
            <AnimatePresence>
                {completed && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 rounded-xl mt-4 text-center"
                        style={{ background: 'rgba(0,245,212,0.04)', border: '1px solid rgba(0,245,212,0.15)' }}
                    >
                        <p className="font-display text-lg font-bold tracking-[2px]" style={{ color: '#00f5d4' }}>
                            ✓ TARGET CRACKED
                        </p>
                        <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                            Completed in {attempts.toLocaleString()} simulated attempts
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
