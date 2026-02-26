'use client';

import { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';

interface DomainSVGProps {
    domain: string;
    className?: string;
}

function DomainSVG({ domain, className }: DomainSVGProps) {
    const textRef = useRef<SVGTextElement>(null);
    const [textWidth, setTextWidth] = useState(300);
    const [ready, setReady] = useState(false);

    const viewH = 80;
    const padding = 24;

    useEffect(() => {
        setReady(false);
        const raf = requestAnimationFrame(() => {
            if (textRef.current) {
                const w = textRef.current.getComputedTextLength();
                setTextWidth(w);
            }
            setReady(true);
        });
        return () => cancelAnimationFrame(raf);
    }, [domain]);

    const viewW = textWidth + padding * 2;
    const gradId = `dsvg-grad-${domain.replace(/[^a-z0-9]/g, '')}`;
    const filterId = `dsvg-glow-${domain.replace(/[^a-z0-9]/g, '')}`;
    const clipId = `dsvg-clip-${domain.replace(/[^a-z0-9]/g, '')}`;

    return (
        <div className={className}>
            <svg
                viewBox={`0 0 ${viewW} ${viewH}`}
                width="100%"
                height={viewH}
                style={{ maxWidth: Math.min(viewW, 700), overflow: 'visible' }}
                aria-label={domain}
            >
                <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="45%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>

                    <filter id={filterId} x="-20%" y="-60%" width="140%" height="220%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Reveal clip: animated rect sweeping left → right */}
                    <clipPath id={clipId}>
                        <motion.rect
                            x={0}
                            y={0}
                            height={viewH}
                            initial={{ width: 0 }}
                            animate={ready ? { width: viewW + 10 } : { width: 0 }}
                            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        />
                    </clipPath>
                </defs>

                {/* Outline ghost (always shown, very dim) */}
                <text
                    ref={textRef}
                    x={padding}
                    y={56}
                    fontSize={44}
                    fontFamily="'Space Mono', 'Fira Code', monospace"
                    fontWeight="700"
                    fill="none"
                    stroke="rgba(139,92,246,0.12)"
                    strokeWidth={1}
                    letterSpacing={1}
                >
                    {domain}
                </text>

                {/* Gradient fill — revealed by clip */}
                <text
                    x={padding}
                    y={56}
                    fontSize={44}
                    fontFamily="'Space Mono', 'Fira Code', monospace"
                    fontWeight="700"
                    fill={`url(#${gradId})`}
                    filter={`url(#${filterId})`}
                    clipPath={`url(#${clipId})`}
                    letterSpacing={1}
                >
                    {domain}
                </text>

                {/* Stroke outline — revealed with slight delay */}
                <motion.text
                    x={padding}
                    y={56}
                    fontSize={44}
                    fontFamily="'Space Mono', 'Fira Code', monospace"
                    fontWeight="700"
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth={0.6}
                    letterSpacing={1}
                    initial={{ opacity: 0 }}
                    animate={ready ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                >
                    {domain}
                </motion.text>
            </svg>
        </div>
    );
}

export default memo(DomainSVG);
