'use client';

import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Laptop, Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Laptop {
    name: string;
    slug: string;
    subtitle: string;
    specs: string;
    accent: string;
    aiScore: number;
}

const LAPTOPS: Laptop[] = [
    {
        name: 'MacBook Pro',
        slug: 'apple',
        subtitle: 'M4 Pro / M4 Max',
        specs: 'Apple Silicon · Neural Engine 38-core',
        accent: '#a0a0a0',
        aiScore: 98,
    },
    {
        name: 'Dell XPS 16',
        slug: 'dell',
        subtitle: 'Intel Core Ultra 9',
        specs: 'RTX 4070 · Intel AI Boost NPU',
        accent: '#007db8',
        aiScore: 93,
    },
    {
        name: 'Lenovo ThinkPad X1',
        slug: 'lenovo',
        subtitle: 'Intel Core Ultra 7',
        specs: 'Intel Arc GPU · AI Performance Core',
        accent: '#e2241a',
        aiScore: 91,
    },
    {
        name: 'ASUS ProArt',
        slug: 'asus',
        subtitle: 'RTX 4080 Laptop',
        specs: 'NVIDIA DLSS 3 · 240Hz OLED',
        accent: '#00b0c8',
        aiScore: 95,
    },
    {
        name: 'HP ZBook Studio',
        slug: 'hp',
        subtitle: 'Intel Xeon / Core Ultra',
        specs: 'RTX 4090 · ISV certified workstation',
        accent: '#0096d6',
        aiScore: 89,
    },
    {
        name: 'MSI Creator Z16',
        slug: 'msi',
        subtitle: 'Core Ultra 9 / RTX 4070',
        specs: 'True Pixel OLED · AI Engine+',
        accent: '#c00',
        aiScore: 90,
    },
    {
        name: 'Razer Blade 18',
        slug: 'razer',
        subtitle: 'Core i9 · RTX 4090',
        specs: 'Vapor Chamber · 4K 200Hz display',
        accent: '#00d700',
        aiScore: 88,
    },
];

function BrandLogo({ slug, name, size = 22 }: { slug: string; name: string; size?: number }) {
    const [failed, setFailed] = useState(false);
    if (failed) {
        return (
            <span className="text-white/50 font-bold text-xs">{name.slice(0, 2).toUpperCase()}</span>
        );
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`https://cdn.simpleicons.org/${slug}/ffffff`}
            alt={name}
            width={size}
            height={size}
            onError={() => setFailed(true)}
            className="object-contain flex-shrink-0"
            style={{ width: size, height: size, opacity: 0.8 }}
        />
    );
}

function AIScoreBar({ score }: { score: number }) {
    const color = score >= 95 ? '#c084fc' : score >= 90 ? '#818cf8' : '#38bdf8';
    return (
        <div className="flex items-center gap-2 mt-2">
            <span className="text-[9px] text-white/35 w-12 flex-shrink-0">AI Score</span>
            <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        boxShadow: `0 0 6px ${color}60`,
                    }}
                />
            </div>
            <span className="text-[10px] font-semibold tabular-nums" style={{ color }}>
                {score}
            </span>
        </div>
    );
}

function LaptopCard({ laptop, delay }: { laptop: Laptop; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
            whileHover={{ scale: 1.03, y: -3 }}
            className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 flex flex-col gap-2.5 transition-all duration-300 cursor-default hover:border-white/[0.14]"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                        background: `${laptop.accent}14`,
                        border: `1px solid ${laptop.accent}28`,
                    }}
                >
                    <BrandLogo slug={laptop.slug} name={laptop.name} size={18} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/85 truncate">{laptop.name}</p>
                    <p className="text-[10px] text-white/40 truncate">{laptop.subtitle}</p>
                </div>
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed">{laptop.specs}</p>
            <AIScoreBar score={laptop.aiScore} />
        </motion.div>
    );
}

interface LaptopRecommendationsProps {
    className?: string;
}

function LaptopRecommendations({ className }: LaptopRecommendationsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
                'rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-5',
                className
            )}
        >
            <div className="flex items-center gap-2 mb-4">
                <Laptop size={15} className="text-blue-400" />
                <span className="text-sm font-semibold text-white/80">Laptop tốt nhất cho AI</span>
                <span className="ml-auto text-[10px] text-white/25">Xếp hạng theo AI performance</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {LAPTOPS.map((laptop, i) => (
                    <LaptopCard key={laptop.name} laptop={laptop} delay={0.05 * i} />
                ))}
            </div>
        </motion.div>
    );
}

export default memo(LaptopRecommendations);
