/**
 * App.jsx – SecurePass Full-Screen Immersive Layout
 * Redesigned: sidebar navigation + full-viewport content panels
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import PasswordInput from './components/PasswordInput';
import StrengthMeter from './components/StrengthMeter';
import EntropyChart from './components/EntropyChart';
import BreachCheck from './components/BreachCheck';
import BruteForceSimulation from './components/BruteForceSimulation';
import HashingDemo from './components/HashingDemo';
import SecurityReport from './components/SecurityReport';
import Particles from './components/Particles';

import { analyzePassword } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [breachResult, setBreachResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!password) return;
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzePassword(password);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Analysis failed. Make sure the server is running.');
    }
    setAnalyzing(false);
  }, [password]);

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.99 },
  };

  const pageTransition = {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1],
  };

  const tabs = [
    { id: 'analyzer', label: 'Analyzer', icon: '◈', color: '#00f5d4', desc: 'Strength analysis' },
    { id: 'breach', label: 'Breach Scan', icon: '⬡', color: '#f72585', desc: 'HIBP database' },
    { id: 'bruteforce', label: 'Attack Sim', icon: '⟁', color: '#ff6b35', desc: 'Brute force demo' },
    { id: 'hashing', label: 'Hash Lab', icon: '⬢', color: '#7b2ff7', desc: 'Bcrypt explorer' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="app-shell">
      {/* ─── Background Layers ──────────── */}
      <div className="mesh-bg" />
      <div className="grid-overlay" />
      <div className="hex-pattern" />
      <Particles />

      {/* ─── Sidebar ──────────────────────── */}
      <motion.aside
        className="sidebar"
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <motion.button
            className="sidebar-logo-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            type="button"
          >
            <div className="sidebar-logo-icon pulse-ring">
              <span style={{ color: '#00f5d4', fontSize: '16px' }}>⬡</span>
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="sidebar-logo-text glitch-hover"
                >
                  SECUREPASS
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Nav Items */}
        <nav className="sidebar-nav">
          {tabs.map((tab, i) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                '--tab-color': tab.color,
              }}
            >
              <div className="sidebar-nav-icon" style={{
                background: activeTab === tab.id ? `${tab.color}15` : 'rgba(255,255,255,0.02)',
                borderColor: activeTab === tab.id ? `${tab.color}30` : 'transparent',
                color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
              }}>
                <span>{tab.icon}</span>
              </div>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="sidebar-nav-text"
                  >
                    <span className="sidebar-nav-label" style={{
                      color: activeTab === tab.id ? tab.color : 'var(--text-secondary)',
                    }}>
                      {tab.label}
                    </span>
                    <span className="sidebar-nav-desc">{tab.desc}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active indicator bar */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="sidebarActive"
                  className="sidebar-active-bar"
                  style={{ background: tab.color }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sidebar-footer"
            >
              <div className="sidebar-status">
                <span className="status-dot">
                  <span className="status-dot-ping" />
                  <span className="status-dot-solid" />
                </span>
                <span className="sidebar-status-text">
                  Zero-knowledge · Encrypted
                </span>
              </div>
              <a
                href="https://haveibeenpwned.com"
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-link"
              >
                Powered by HIBP ↗
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* ─── Mobile Top Bar ──────────────── */}
      <div className="mobile-topbar">
        <div className="mobile-topbar-inner">
          <div className="mobile-logo">
            <div className="sidebar-logo-icon pulse-ring" style={{ width: 32, height: 32 }}>
              <span style={{ color: '#00f5d4', fontSize: '14px' }}>⬡</span>
            </div>
            <span className="sidebar-logo-text glitch-hover" style={{ fontSize: '11px' }}>
              SECUREPASS
            </span>
          </div>
          <div className="mobile-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className="mobile-tab-btn"
                style={{
                  color: activeTab === tab.id ? tab.color : 'rgba(136,136,170,0.4)',
                  background: activeTab === tab.id ? `${tab.color}12` : 'transparent',
                }}
              >
                <span>{tab.icon}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="mobileTabIndicator"
                    className="mobile-tab-indicator"
                    style={{ background: tab.color }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content Area ────────────── */}
      <main className="main-content">
        <div className="content-inner">

          {/* ─── Page Header ──────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="page-header"
          >
            <div className="page-header-left">
              <div className="page-header-icon" style={{
                background: `${currentTab?.color}10`,
                borderColor: `${currentTab?.color}20`,
              }}>
                <span style={{ color: currentTab?.color, fontSize: '20px' }}>{currentTab?.icon}</span>
              </div>
              <div>
                <h1 className="page-title">
                  <span style={{
                    background: `linear-gradient(135deg, ${currentTab?.color}, #fff)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    {currentTab?.label}
                  </span>
                </h1>
                <p className="page-subtitle">{currentTab?.desc}</p>
              </div>
            </div>

            {/* Status Pill */}
            <div className="header-pill">
              <span className="status-dot" style={{ transform: 'scale(0.7)' }}>
                <span className="status-dot-ping" />
                <span className="status-dot-solid" />
              </span>
              <span style={{ color: '#00f5d4', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600 }}>
                Secure
              </span>
            </div>
          </motion.div>

          {/* ─── Unified Password Bar ─────── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="password-bar-wrapper"
          >
            <PasswordInput
              password={password}
              setPassword={setPassword}
              onAnalyze={handleAnalyze}
              activeTab={activeTab}
            />
          </motion.div>

          {/* ─── Error Message ─────────────── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="error-banner"
              >
                <p style={{ color: '#ff5252', fontSize: '12px', textAlign: 'center' }}>⚠ {error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Tab Content ───────────────── */}
          <div className="tab-content-area">
            <AnimatePresence mode="wait">
              {/* ═══ ANALYZER ═══ */}
              {activeTab === 'analyzer' && (
                <motion.div
                  key="analyzer"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="tab-panel"
                >
                  {analyzing && (
                    <div className="glass-card p-12 text-center">
                      <div className="relative inline-block mb-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          style={{
                            width: 64, height: 64, borderRadius: '50%',
                            border: '2px solid rgba(0,245,212,0.2)',
                            borderTopColor: '#00f5d4',
                          }}
                        />
                        <span style={{
                          position: 'absolute', inset: 0, display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '20px', color: '#00f5d4',
                        }}>◈</span>
                      </div>
                      <p className="font-display" style={{ fontSize: '11px', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Analyzing Security
                      </p>
                    </div>
                  )}

                  {analysis && !analyzing && (
                    <div className="analyzer-results">
                      <div className="analyzer-grid">
                        <div className="analyzer-main">
                          <StrengthMeter analysis={analysis} />
                        </div>
                        <div className="analyzer-side">
                          <EntropyChart analysis={analysis} password={password} />
                        </div>
                      </div>
                      <SecurityReport analysis={analysis} breachResult={breachResult} password={password} />
                    </div>
                  )}

                  {!analysis && !analyzing && (
                    <div className="glass-card empty-state">
                      <div className="empty-icon">
                        <span style={{ fontSize: '40px' }}>🔍</span>
                      </div>
                      <h3 className="empty-title font-display">READY TO ANALYZE</h3>
                      <p className="empty-desc">
                        Enter a password above and click <strong style={{ color: '#00f5d4' }}>Deep Analysis</strong> to get
                        a comprehensive security breakdown with entropy calculation, crack time estimation, and improvement suggestions.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══ BREACH ═══ */}
              {activeTab === 'breach' && (
                <motion.div
                  key="breach"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="tab-panel"
                >
                  <BreachCheck password={password} onBreachResult={setBreachResult} />
                </motion.div>
              )}

              {/* ═══ BRUTE FORCE ═══ */}
              {activeTab === 'bruteforce' && (
                <motion.div
                  key="bruteforce"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="tab-panel"
                >
                  <BruteForceSimulation password={password} />
                </motion.div>
              )}

              {/* ═══ HASHING ═══ */}
              {activeTab === 'hashing' && (
                <motion.div
                  key="hashing"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  className="tab-panel"
                >
                  <HashingDemo password={password} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
