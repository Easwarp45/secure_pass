/**
 * Particles Component – Premium floating elements
 */

import { useMemo } from 'react';

export default function Particles() {
    const particles = useMemo(() => {
        return Array.from({ length: 30 }, (_, i) => {
            const type = Math.random();
            return {
                id: i,
                left: `${Math.random() * 100}%`,
                size: type > 0.7 ? `${3 + Math.random() * 3}px` : `${1.5 + Math.random() * 2}px`,
                delay: `${Math.random() * 25}s`,
                duration: `${18 + Math.random() * 25}s`,
                color: type > 0.8
                    ? 'rgba(123, 47, 247, 0.4)'
                    : type > 0.5
                        ? 'rgba(0, 245, 212, 0.35)'
                        : 'rgba(247, 37, 133, 0.25)',
            };
        });
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        width: p.size,
                        height: p.size,
                        animationDelay: p.delay,
                        animationDuration: p.duration,
                        background: p.color,
                        boxShadow: `0 0 6px ${p.color}`,
                    }}
                />
            ))}
        </div>
    );
}
