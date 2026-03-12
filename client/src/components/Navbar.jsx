/**
 * Navbar – Premium Cyberpunk Navigation
 * Fixed: proper z-index, cleaner mobile tabs, smooth transitions
 */

import { motion } from 'framer-motion';

export default function Navbar({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'analyzer', label: 'Analyzer', icon: '◈', color: '#00f5d4' },
        { id: 'breach', label: 'Breach Scan', icon: '⬡', color: '#f72585' },
        { id: 'bruteforce', label: 'Attack Sim', icon: '⟁', color: '#ff6b35' },
        { id: 'hashing', label: 'Hash Lab', icon: '⬢', color: '#7b2ff7' },
    ];

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50"
            style={{
                background: 'rgba(5, 5, 16, 0.85)',
                backdropFilter: 'blur(30px) saturate(120%)',
                WebkitBackdropFilter: 'blur(30px) saturate(120%)',
                borderBottom: '1px solid rgba(0, 245, 212, 0.06)',
            }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-[68px]">
                    {/* ─── Logo ──────────────────────── */}
                    <motion.button
                        className="flex items-center gap-3 cursor-pointer group"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActiveTab('analyzer')}
                        type="button"
                    >
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center pulse-ring"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(0,245,212,0.15), rgba(123,47,247,0.15))',
                                    border: '1px solid rgba(0,245,212,0.2)',
                                }}>
                                <span className="text-base" style={{ color: '#00f5d4' }}>⬡</span>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-display text-sm font-bold tracking-[3px] glitch-hover"
                                style={{
                                    background: 'linear-gradient(135deg, #00f5d4, #00b4d8, #7b2ff7)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                SECUREPASS
                            </span>
                        </div>
                    </motion.button>

                    {/* ─── Desktop Tabs ──────────────── */}
                    <div className="hidden md:flex items-center gap-1">
                        {tabs.map((tab, i) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08 }}
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                className="relative px-4 py-2 rounded-xl text-[12px] font-semibold tracking-wide transition-all duration-300"
                                style={{
                                    color: activeTab === tab.id ? tab.color : 'rgba(136,136,170,0.6)',
                                    background: activeTab === tab.id ? `${tab.color}08` : 'transparent',
                                    border: `1px solid ${activeTab === tab.id ? `${tab.color}20` : 'transparent'}`,
                                }}
                            >
                                <span className="mr-1.5 text-[10px]">{tab.icon}</span>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-px left-4 right-4 h-[2px] rounded-full"
                                        style={{ background: `linear-gradient(90deg, transparent, ${tab.color}, transparent)` }}
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* ─── Mobile Tabs ───────────────── */}
                    <div className="flex md:hidden items-center gap-1 p-1 rounded-xl"
                        style={{ background: 'rgba(5,5,16,0.5)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                type="button"
                                className="relative w-10 h-9 rounded-lg flex items-center justify-center text-base transition-all"
                                style={{
                                    color: activeTab === tab.id ? tab.color : 'rgba(136,136,170,0.4)',
                                    background: activeTab === tab.id ? `${tab.color}12` : 'transparent',
                                }}
                            >
                                {tab.icon}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="mobileTab"
                                        className="absolute -bottom-0.5 left-2 right-2 h-[1.5px] rounded-full"
                                        style={{ background: tab.color }}
                                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
