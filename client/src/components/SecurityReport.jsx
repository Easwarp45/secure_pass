/**
 * SecurityReport – Premium PDF report download button
 */

import { motion } from 'framer-motion';

export default function SecurityReport({ analysis, breachResult, password }) {
    const handleDownload = async () => {
        try {
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();
            const pw = doc.internal.pageSize.getWidth();

            // Header
            doc.setFillColor(5, 5, 16);
            doc.rect(0, 0, pw, 50, 'F');
            doc.setTextColor(0, 245, 212);
            doc.setFontSize(22);
            doc.text('SECUREPASS', pw / 2, 18, { align: 'center' });
            doc.setFontSize(10);
            doc.setTextColor(136, 136, 170);
            doc.text('Security Assessment Report', pw / 2, 28, { align: 'center' });
            doc.text(`Generated: ${new Date().toLocaleString()}`, pw / 2, 36, { align: 'center' });
            doc.text('Your password is NOT included in this report.', pw / 2, 44, { align: 'center' });

            let y = 62;

            // Strength Section
            doc.setTextColor(30, 30, 30);
            doc.setFontSize(14);
            doc.text('Password Strength Analysis', 14, y);
            y += 10;
            doc.setFontSize(10);

            if (analysis) {
                const items = [
                    `Score: ${analysis.score}/100 (${analysis.label})`,
                    `Entropy: ${analysis.entropy} bits`,
                    `Character Set: ${analysis.charsetSize} characters`,
                    `Length: ${analysis.checks?.length || 'N/A'} characters`,
                    `Lowercase: ${analysis.checks?.lowercase ? 'Yes' : 'No'}`,
                    `Uppercase: ${analysis.checks?.uppercase ? 'Yes' : 'No'}`,
                    `Numbers: ${analysis.checks?.numbers ? 'Yes' : 'No'}`,
                    `Special Characters: ${analysis.checks?.special ? 'Yes' : 'No'}`,
                    `Common Password: ${analysis.checks?.isCommon ? 'YES' : 'No'}`,
                    `Crack Time: ${analysis.crackTime?.formatted || 'N/A'}`,
                ];
                items.forEach((item) => { doc.text(`  •  ${item}`, 18, y); y += 6.5; });
            }

            y += 6;

            // Suggestions
            if (analysis?.suggestions?.length) {
                doc.setFontSize(14);
                doc.text('Recommendations', 14, y);
                y += 10;
                doc.setFontSize(10);
                analysis.suggestions.forEach((s) => { doc.text(`  →  ${s}`, 18, y); y += 6.5; });
                y += 6;
            }

            // Breach
            if (breachResult) {
                doc.setFontSize(14);
                doc.text('Breach Check Result', 14, y);
                y += 10;
                doc.setFontSize(10);
                if (breachResult.found) {
                    doc.setTextColor(220, 50, 50);
                    doc.text(`  WARNING: Found in ${breachResult.count?.toLocaleString()} breaches`, 18, y);
                    doc.setTextColor(30, 30, 30);
                } else {
                    doc.setTextColor(0, 150, 100);
                    doc.text('  Not found in known breaches.', 18, y);
                    doc.setTextColor(30, 30, 30);
                }
                y += 12;
            }

            // Tips
            doc.setFontSize(14);
            doc.text('Security Best Practices', 14, y);
            y += 10;
            doc.setFontSize(9);
            [
                'Use unique passwords for every account',
                'Enable two-factor authentication (2FA)',
                'Use a reputable password manager',
                'Never share passwords via email or chat',
                'Change passwords if compromised',
                'Use passphrases for better memorability',
                'Minimum 12 characters recommended',
            ].forEach((t) => { doc.text(`  ✓  ${t}`, 18, y); y += 6; });

            // Footer
            const ph = doc.internal.pageSize.getHeight();
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.text('SecurePass — Password Strength & Breach Checker | Your password was NOT stored or included.', pw / 2, ph - 8, { align: 'center' });

            doc.save('SecurePass_Report.pdf');
        } catch (err) {
            console.error('PDF failed:', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,245,212,0.06)', border: '1px solid rgba(0,245,212,0.1)' }}>
                    <span>📄</span>
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">Security Report</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Download comprehensive PDF analysis
                    </p>
                </div>
            </div>
            <motion.button
                onClick={handleDownload}
                disabled={!analysis}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary text-sm disabled:opacity-30 whitespace-nowrap"
            >
                ↓ Download PDF
            </motion.button>
        </motion.div>
    );
}
