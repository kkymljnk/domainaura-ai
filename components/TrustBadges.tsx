'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Badge {
    id: string;
    icon: React.ElementType;
    label: string;
    sub: string;
    color: string;
    glow: string;
}

const BADGES: Badge[] = [
    {
        id: 'grok',
        icon: BrainCircuit,
        label: 'Powered by Grok AI',
        sub: 'xAI · Real-time intelligence',
        color: '#8b5cf6',
        glow: 'rgba(139,92,246,0.22)',
    },
    {
        id: 'whois',
        icon: Wifi,
        label: 'Real WHOIS',
        sub: 'RDAP live data · No cache',
        color: '#06b6d4',
        glow: 'rgba(6,182,212,0.2)',
    },
    {
        id: 'secure',
        icon: Shield,
        label: 'Secure',
        sub: 'HTTPS · No data stored',
        color: '#10b981',
        glow: 'rgba(16,185,129,0.2)',
    },
];

interface TrustBadgesProps {
    className?: string;
    compact?: boolean;
}

function TrustBadges({ className, compact = false }: TrustBadgesProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className={cn('flex flex-wrap items-center justify-center gap-3', className)}
        >
            {BADGES.map((badge, i) => {
                const Icon = badge.icon;
                return (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.35 }}
                        whileHover={{ scale: 1.06, y: -2 }}
                        className={cn(
                            'group flex items-center gap-2 rounded-xl border transition-all duration-200 cursor-default',
                            compact
                                ? 'px-2.5 py-1.5'
                                : 'px-3.5 py-2.5',
                            'border-white/[0.08] bg-white/[0.03] backdrop-blur-sm hover:border-white/[0.15]'
                        )}
                        style={{
                            boxShadow: `0 0 0px ${badge.glow}`,
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 18px ${badge.glow}, 0 2px 12px rgba(0,0,0,0.3)`;
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0px ${badge.glow}`;
                        }}
                    >
                        {/* Icon */}
                        <div
                            className={cn(
                                'rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300',
                                compact ? 'w-5 h-5' : 'w-7 h-7'
                            )}
                            style={{
                                background: `${badge.color}12`,
                                border: `1px solid ${badge.color}20`,
                            }}
                        >
                            <Icon
                                size={compact ? 10 : 13}
                                style={{ color: badge.color }}
                                className="group-hover:scale-110 transition-transform duration-200"
                            />
                        </div>

                        {/* Text */}
                        <div className={compact ? 'hidden sm:block' : ''}>
                            <p className={cn('font-semibold text-white/75 leading-none', compact ? 'text-[10px]' : 'text-xs')}>
                                {badge.label}
                            </p>
                            {!compact && (
                                <p className="text-[10px] text-white/30 mt-0.5 leading-none">{badge.sub}</p>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

export default memo(TrustBadges);
