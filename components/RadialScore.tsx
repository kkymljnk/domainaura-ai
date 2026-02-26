'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';

interface RadialScoreProps {
    score: number;
    label?: string;
    size?: number;
    strokeWidth?: number;
    delay?: number;
}

function RadialScore({ score, label = 'Score', size = 160, strokeWidth = 10, delay = 0.2 }: RadialScoreProps) {
    const [displayed, setDisplayed] = useState(0);
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const center = size / 2;
    const gradId = `radial-grad-${label.replace(/\s/g, '')}`;
    const filterId = `radial-glow-${label.replace(/\s/g, '')}`;

    // Count-up animation
    useEffect(() => {
        let frame: number;
        const start = performance.now();
        const duration = 1400;
        const animate = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setDisplayed(Math.round(ease * score));
            if (p < 1) frame = requestAnimationFrame(animate);
        };
        const t = setTimeout(() => { frame = requestAnimationFrame(animate); }, delay * 1000);
        return () => { clearTimeout(t); cancelAnimationFrame(frame); };
    }, [score, delay]);

    const color = score >= 90 ? '#c084fc' : score >= 75 ? '#818cf8' : '#38bdf8';
    const glowColor = score >= 90 ? 'rgba(192,132,252,0.5)' : score >= 75 ? 'rgba(129,140,248,0.5)' : 'rgba(56,189,248,0.5)';

    return (
        <div className="flex flex-col items-center gap-3 select-none">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} style={{ overflow: 'visible' }}>
                    <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#c084fc" />
                            <stop offset="50%" stopColor="#818cf8" />
                            <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Track */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={strokeWidth}
                    />

                    {/* Glow duplicate (slightly wider, blurred, behind) */}
                    <motion.circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={`url(#${gradId})`}
                        strokeWidth={strokeWidth + 4}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay }}
                        style={{
                            rotate: '-90deg',
                            transformOrigin: `${center}px ${center}px`,
                            filter: `blur(6px)`,
                            opacity: 0.5,
                        }}
                    />

                    {/* Main arc */}
                    <motion.circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke={`url(#${gradId})`}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay }}
                        style={{
                            rotate: '-90deg',
                            transformOrigin: `${center}px ${center}px`,
                            filter: `url(#${filterId})`,
                        }}
                    />
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                    <motion.span
                        className="font-black tabular-nums leading-none"
                        style={{
                            fontSize: size * 0.22,
                            color,
                            textShadow: `0 0 20px ${glowColor}`,
                        }}
                    >
                        {displayed}
                    </motion.span>
                    <span className="text-white/40 font-medium" style={{ fontSize: size * 0.085 }}>
                        /100
                    </span>
                </div>
            </div>

            <div className="text-center">
                <p className="text-sm font-semibold text-white/75">{label}</p>
            </div>
        </div>
    );
}

export default memo(RadialScore);
