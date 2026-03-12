/**
 * Footer – Minimal premium footer with proper z-index
 */

import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative z-10 mt-16 pb-8"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Neon divider */}
                <div className="neon-line mb-6" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                            style={{
                                background: 'rgba(0,245,212,0.06)',
                                border: '1px solid rgba(0,245,212,0.1)',
                            }}>
                            <span className="text-[10px]" style={{ color: '#00f5d4' }}>⬡</span>
                        </div>
                        <span className="font-display text-[10px] tracking-[2px]" style={{ color: 'var(--text-muted)' }}>
                            SECUREPASS v1.0
                        </span>
                    </div>

                    {/* Privacy */}
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                        </span>
                        <span className="text-[10px] tracking-wide" style={{ color: 'var(--text-muted)' }}>
                            Zero-knowledge · No storage · Privacy first
                        </span>
                    </div>

                    {/* Attribution */}
                    <a
                        href="https://haveibeenpwned.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] tracking-wide transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => e.target.style.color = '#00f5d4'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                        Powered by HaveIBeenPwned ↗
                    </a>
                </div>
            </div>
        </motion.footer>
    );
}
