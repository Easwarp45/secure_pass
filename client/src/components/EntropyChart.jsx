/**
 * EntropyChart – Premium chart visualizations
 * Matched height with StrengthMeter for grid alignment
 */

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function EntropyChart({ analysis, password }) {
    if (!analysis || !password) return null;

    const charDistribution = useMemo(() => {
        const lower = (password.match(/[a-z]/g) || []).length;
        const upper = (password.match(/[A-Z]/g) || []).length;
        const digits = (password.match(/[0-9]/g) || []).length;
        const special = (password.match(/[^a-zA-Z0-9]/g) || []).length;

        return {
            labels: ['Lowercase', 'Uppercase', 'Numbers', 'Special'],
            datasets: [{
                data: [lower, upper, digits, special],
                backgroundColor: [
                    'rgba(0, 245, 212, 0.6)',
                    'rgba(123, 47, 247, 0.6)',
                    'rgba(255, 107, 53, 0.6)',
                    'rgba(247, 37, 133, 0.6)',
                ],
                borderColor: ['#00f5d4', '#7b2ff7', '#ff6b35', '#f72585'],
                borderWidth: 2,
                hoverBorderWidth: 3,
                hoverOffset: 6,
            }],
        };
    }, [password]);

    const entropyData = useMemo(() => {
        const current = analysis.entropy || 0;
        return {
            labels: ['Yours', 'Moderate', 'Strong', 'Maximum'],
            datasets: [{
                label: 'Entropy (bits)',
                data: [current, 50, 80, 128],
                backgroundColor: [
                    current >= 60 ? 'rgba(0, 245, 212, 0.5)' : current >= 40 ? 'rgba(255, 145, 0, 0.5)' : 'rgba(255, 23, 68, 0.5)',
                    'rgba(123, 47, 247, 0.15)',
                    'rgba(0, 180, 216, 0.15)',
                    'rgba(0, 245, 212, 0.1)',
                ],
                borderColor: [
                    current >= 60 ? '#00f5d4' : current >= 40 ? '#ff9100' : '#ff1744',
                    'rgba(123, 47, 247, 0.3)',
                    'rgba(0, 180, 216, 0.3)',
                    'rgba(0, 245, 212, 0.2)',
                ],
                borderWidth: 1.5,
                borderRadius: 6,
            }],
        };
    }, [analysis]);

    const chartColors = {
        backgroundColor: 'rgba(5,5,16,0.95)',
        titleColor: '#fff',
        bodyColor: '#aaa',
        borderColor: 'rgba(0,245,212,0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'rgba(136,136,170,0.7)',
                    font: { size: 10, family: 'Inter' },
                    padding: 12,
                    usePointStyle: true,
                    pointStyleWidth: 8,
                },
            },
            tooltip: chartColors,
        },
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                max: 130,
                grid: { color: 'rgba(255,255,255,0.02)', drawBorder: false },
                ticks: { color: 'rgba(136,136,170,0.5)', font: { size: 9 } },
            },
            y: {
                grid: { display: false },
                ticks: { color: 'rgba(136,136,170,0.6)', font: { size: 10, family: 'Inter' } },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: chartColors,
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-7 sm:p-8 h-full flex flex-col"
        >
            {/* ─── Header ──────────────────────── */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(123,47,247,0.1), rgba(247,37,133,0.06))',
                            border: '1px solid rgba(123,47,247,0.12)',
                        }}>
                        <span className="text-lg">📈</span>
                    </div>
                    <div>
                        <h3 className="font-display text-sm font-bold tracking-[2px] text-white">
                            VISUALS
                        </h3>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Charts & distribution</p>
                    </div>
                </div>
                <div className="cyber-badge cyber-badge-purple">
                    {analysis.entropy} bits
                </div>
            </div>

            {/* ─── Charts ──────────────────────── */}
            <div className="flex-1 space-y-6">
                {/* Doughnut */}
                <div>
                    <h4 className="text-[9px] tracking-[2px] uppercase font-semibold mb-3"
                        style={{ color: 'var(--text-secondary)' }}>
                        Character Distribution
                    </h4>
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(5,5,16,0.5)', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ height: '200px' }}>
                            <Doughnut data={charDistribution} options={doughnutOptions} />
                        </div>
                    </div>
                </div>

                {/* Bar */}
                <div>
                    <h4 className="text-[9px] tracking-[2px] uppercase font-semibold mb-3"
                        style={{ color: 'var(--text-secondary)' }}>
                        Entropy Benchmark
                    </h4>
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(5,5,16,0.5)', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ height: '140px' }}>
                            <Bar data={entropyData} options={barOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
