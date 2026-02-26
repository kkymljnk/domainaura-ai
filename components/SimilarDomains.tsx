'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, Lock, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SimilarDomain {
    domain: string;
    status: 'available' | 'registered' | 'unknown';
    price: string | null;
}

interface SimilarDomainsProps {
    domains?: SimilarDomain[];
    /** Shown when no domains prop provided (default suggestions) */
    defaultDomains?: SimilarDomain[];
    className?: string;
}

const DEFAULT_DOMAINS: SimilarDomain[] = [
    { domain: 'saigon.ceo', status: 'available', price: '$35/yr' },
    { domain: 'vietnam.ai', status: 'available', price: '$199/yr' },
    { domain: 'tech.ceo', status: 'registered', price: null },
    { domain: 'hanoi.ai', status: 'available', price: '$199/yr' },
    { domain: 'ceo.vn', status: 'registered', price: null },
];

function DomainCard({ item, index }: { item: SimilarDomain; index: number }) {
    const isAvailable = item.status === 'available';
    const isRegistered = item.status === 'registered';

    const glow = isAvailable
        ? 'rgba(139,92,246,0.18)'
        : isRegistered
            ? 'rgba(16,185,129,0.14)'
            : 'rgba(245,158,11,0.12)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.06 * index, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.035, y: -3 }}
            className={cn(
                'group relative flex items-center justify-between gap-3',
                'rounded-xl border border-white/[0.07] bg-white/[0.03]',
                'px-4 py-3 transition-all duration-300 cursor-default',
                'hover:border-white/[0.14]'
            )}
            style={{ '--glow': glow } as React.CSSProperties}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${glow}, 0 4px 20px rgba(0,0,0,0.35)`;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
        >
            {/* Domain name */}
            <div className="flex items-center gap-2.5 min-w-0">
                <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                        background: isAvailable
                            ? 'rgba(139,92,246,0.12)'
                            : isRegistered
                                ? 'rgba(16,185,129,0.12)'
                                : 'rgba(245,158,11,0.10)',
                        border: isAvailable
                            ? '1px solid rgba(139,92,246,0.22)'
                            : isRegistered
                                ? '1px solid rgba(16,185,129,0.22)'
                                : '1px solid rgba(245,158,11,0.18)',
                    }}
                >
                    <Globe
                        size={13}
                        style={{
                            color: isAvailable ? '#a78bfa' : isRegistered ? '#34d399' : '#fbbf24',
                        }}
                    />
                </div>
                <span className="text-sm font-mono font-semibold text-white/80 truncate group-hover:text-white transition-colors">
                    {item.domain}
                </span>
            </div>

            {/* Right side: status + price */}
            <div className="flex items-center gap-2 flex-shrink-0">
                {item.price && (
                    <span className="text-[10px] font-mono text-white/40 hidden sm:block">
                        {item.price}
                    </span>
                )}

                {isAvailable && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 border border-purple-500/25 text-purple-400">
                        <Zap size={9} /> Còn trống
                    </span>
                )}
                {isRegistered && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                        <Lock size={9} /> Đã đăng ký
                    </span>
                )}
                {!isAvailable && !isRegistered && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        Unknown
                    </span>
                )}

                {/* External link — fires search for available domains */}
                {isAvailable && (
                    <motion.a
                        href={`https://porkbun.com/checkout/search?q=${encodeURIComponent(item.domain)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-white/50 hover:text-purple-400"
                        aria-label={`Register ${item.domain}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink size={12} />
                    </motion.a>
                )}
            </div>
        </motion.div>
    );
}

function SimilarDomains({ domains, defaultDomains, className }: SimilarDomainsProps) {
    const items = domains?.length ? domains : (defaultDomains ?? DEFAULT_DOMAINS);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                'rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Globe size={12} className="text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-white/80">Similar Domains</span>
                    <span className="text-[10px] text-white/30 font-mono ml-1">
                        {items.length} gợi ý
                    </span>
                </div>
                <span className="text-[10px] text-white/25 hidden sm:block">powered by DomainAura AI</span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
                {items.map((item, i) => (
                    <DomainCard key={item.domain} item={item} index={i} />
                ))}
            </div>

            {/* Footer hint */}
            <p className="text-[10px] text-white/20 text-center mt-4">
                Nhấn vào domain còn trống để đăng ký tại Porkbun →
            </p>
        </motion.div>
    );
}

export default memo(SimilarDomains);
