'use client';

import { useState, useCallback, Suspense, lazy, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import DomainInput from '@/components/DomainInput';
import ResultSection from '@/components/ResultSection';
import TrustBadges from '@/components/TrustBadges';
import type { DomainResult } from '@/lib/mockData';

// Dynamic import — no SSR, avoids WebGL hydration mismatch
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), {
    ssr: false,
    loading: () => (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 30% 40%, #1a0533 0%, #050510 50%, #0b0f2a 100%)',
            }}
        />
    ),
});

// ── Logo SVG ──────────────────────────────────────────────────────────────────
function LogoIcon() {
    return (
        <motion.div
            className="float-animation"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
        >
            <svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <radialGradient id="logoGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="50%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#38bdf8" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {/* Outer ring */}
                <motion.circle
                    cx="36"
                    cy="36"
                    r="33"
                    stroke="url(#logoGrad)"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.3 }}
                    filter="url(#glow)"
                />
                {/* Inner hexagon */}
                <motion.polygon
                    points="36,10 58,23 58,49 36,62 14,49 14,23"
                    stroke="url(#logoGrad)"
                    strokeWidth="1"
                    fill="rgba(139,92,246,0.08)"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    style={{ transformOrigin: '36px 36px' }}
                    filter="url(#glow)"
                />
                {/* Center D letter */}
                <motion.text
                    x="36"
                    y="44"
                    textAnchor="middle"
                    fontSize="24"
                    fontWeight="800"
                    fontFamily="Inter, sans-serif"
                    fill="url(#logoGrad)"
                    filter="url(#glow)"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 44 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                >
                    D
                </motion.text>
                {/* Orbiting dot */}
                <motion.circle
                    cx="36"
                    cy="3"
                    r="3"
                    fill="#c084fc"
                    filter="url(#glow)"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    style={{ transformOrigin: '36px 36px' }}
                />
            </svg>
        </motion.div>
    );
}

// ── Tagline badges ─────────────────────────────────────────────────────────────
const TAGS = ['CEO', 'AI', 'Tech Domain Intelligence'];

function TagBadges() {
    return (
        <motion.div
            className="flex flex-wrap justify-center gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
        >
            {TAGS.map((tag, i) => (
                <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="px-3 py-1 rounded-full text-xs font-semibold border"
                    style={{
                        background: `rgba(139, 92, 246, ${0.06 + i * 0.03})`,
                        borderColor: `rgba(139, 92, 246, ${0.25 + i * 0.08})`,
                        color: i === 0 ? '#c084fc' : i === 1 ? '#818cf8' : '#38bdf8',
                        boxShadow: `0 0 12px rgba(139, 92, 246, ${0.1 + i * 0.05})`,
                    }}
                >
                    {i > 0 && <span className="mr-1 opacity-50">•</span>}
                    {tag}
                </motion.span>
            ))}
        </motion.div>
    );
}

// ── Stats bar ──────────────────────────────────────────────────────────────────
const STATS = [
    { label: 'TLDs hỗ trợ', value: '1,500+' },
    { label: 'Chỉ số AI', value: '6 scores' },
    { label: 'RDAP real-time', value: '✓' },
    { label: 'Phân tích', value: 'Miễn phí' },
];

function StatsBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8"
        >
            {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-2 text-sm">
                    <span className="text-white/70 font-semibold">{s.value}</span>
                    <span className="text-white/30">{s.label}</span>
                    {i < STATS.length - 1 && <span className="text-white/15 ml-4">|</span>}
                </div>
            ))}
        </motion.div>
    );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
    const [result, setResult] = useState<DomainResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleResult = useCallback((r: DomainResult | null) => {
        setResult(r);
    }, []);

    return (
        <main className="relative min-h-screen overflow-x-hidden">
            {/* ── 3D Three.js Background ────────────────────────────────── */}
            <ThreeBackground />

            {/* ── Content Layer ─────────────────────────────────────────── */}
            <div className="relative z-10 flex flex-col min-h-screen">
                {/* ── Header ──────────────────────────────────────────────── */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-neon-purple">
                            D
                        </div>
                        <span className="text-sm font-semibold text-white/80">DomainAura</span>
                        <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-400 font-medium">
                            AI
                        </span>
                    </div>

                    <nav className="hidden sm:flex items-center gap-6 text-sm text-white/40">
                        <a href="#" className="hover:text-white/80 transition-colors">Docs</a>
                        <a href="#" className="hover:text-white/80 transition-colors">API</a>
                        <a href="#" className="hover:text-white/80 transition-colors">Pricing</a>
                    </nav>
                </motion.header>

                {/* ── Hero ─────────────────────────────────────────────────── */}
                <section className="flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-8 text-center">
                    <LogoIcon />

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
                    >
                        <span className="gradient-text neon-text">DomainAura</span>
                        <span className="ml-3 text-white/90">AI</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mt-3 text-base sm:text-lg text-white/55 font-light max-w-xl leading-relaxed"
                    >
                        Phân tích domain thông minh theo thời gian thực —{' '}
                        <span className="text-white/80 font-semibold">brand score, SEO, giá trị thị trường</span>{' '}
                        và hơn thế nữa.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                        className="mt-2 text-sm text-white/35 font-light max-w-xl leading-relaxed"
                    >
                        Phù hợp cho{' '}
                        <span className="text-purple-400/80 font-medium">AI &amp; Computer CEO</span>,{' '}
                        <span className="text-cyan-400/80 font-medium">founder công nghệ</span>, hoặc bất kỳ{' '}
                        <span className="text-white/55 font-medium">lãnh đạo doanh nghiệp</span>{' '}
                        nào muốn khẳng định vị thế đẳng cấp.
                    </motion.p>

                    <TagBadges />
                    <StatsBar />

                    {/* ── Trust Badges ─────────────────────────────────────────── */}
                    <TrustBadges className="mt-4" compact />

                    {/* ── Search Input ─────────────────────────────────────────── */}
                    <div className="w-full max-w-2xl mt-12">
                        <DomainInput
                            onResult={handleResult}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    </div>

                    {/* ── Results ──────────────────────────────────────────────── */}
                    {(result || isLoading) && (
                        <div className="w-full max-w-4xl mt-4 px-4">
                            {isLoading && !result && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center gap-4 mt-16"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
                                        <div className="absolute inset-2 w-12 h-12 rounded-full border-2 border-blue-500/20 border-b-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                                    </div>
                                    <p className="text-sm text-white/40 font-mono animate-pulse">
                                        Đang truy vấn RDAP & AI đang phân tích...
                                    </p>
                                </motion.div>
                            )}
                            <ResultSection result={result} />
                        </div>
                    )}

                    {/* ── Footer ───────────────────────────────────────────────── */}
                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                        className="mt-16 pb-8 text-center text-xs text-white/20 space-y-1"
                    >
                        <p>
                            Powered by{' '}
                            <span className="text-purple-400/60">RDAP Global Registry</span> ·{' '}
                            <span className="text-blue-400/60">Next.js 15</span> ·{' '}
                            <span className="text-cyan-400/60">Three.js</span>
                        </p>
                        <p className="text-white/15">© 2026 DomainAura AI · hanoi.ceo</p>
                    </motion.footer>
                </section>
            </div>
        </main>
    );
}
