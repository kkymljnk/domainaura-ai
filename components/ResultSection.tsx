'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    AlertCircle,
    Calendar,
    Server,
    Globe,
    Zap,
    Shield,
    BrainCircuit,
    Cpu,
    Rocket,
    Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { WhoisResult } from '@/lib/types';
import RadialScore from '@/components/RadialScore';
import DomainSVG from '@/components/DomainSVG';
import LinkedAIServices from '@/components/LinkedAIServices';
import LaptopRecommendations from '@/components/LaptopRecommendations';
import ExportPDF from '@/components/ExportPDF';
import SimilarDomains from '@/components/SimilarDomains';
import WhoisCard from '@/components/WhoisCard';
import type { DomainResult } from '@/lib/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(s?: string) {
    if (!s) return null;
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const isRegistered = /registered|active/i.test(status);
    const isAvailable = /available/i.test(status);
    const isUnknown = /unknown|error/i.test(status);

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold flex-shrink-0',
                isRegistered && 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                isAvailable && 'text-purple-400 bg-purple-500/10 border-purple-500/30',
                isUnknown && 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                !isRegistered && !isAvailable && !isUnknown && 'text-white/50 bg-white/5 border-white/10'
            )}
            style={
                isRegistered ? { boxShadow: '0 0 12px rgba(16,185,129,0.2)' } :
                    isAvailable ? { boxShadow: '0 0 12px rgba(139,92,246,0.2)' } : undefined
            }
        >
            {isRegistered ? <CheckCircle size={11} /> : isAvailable ? <Zap size={11} /> : <AlertCircle size={11} />}
            {status}
        </span>
    );
}

// ─── Glass card ───────────────────────────────────────────────────────────────
function GlassCard({
    children,
    className,
    glow,
}: {
    children: React.ReactNode;
    className?: string;
    glow?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                'rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-5',
                className
            )}
            style={glow ? { boxShadow: glow } : undefined}
        >
            {children}
        </motion.div>
    );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'ai', label: 'AI & Tech', icon: BrainCircuit },
    { id: 'laptops', label: 'Laptops', icon: Cpu },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ─── Special potential cards for hanoi.ceo ────────────────────────────────────
const POTENTIAL_CARDS = [
    {
        icon: BrainCircuit,
        title: 'AI CEO Platform',
        desc: 'Nền tảng AI dành riêng cho CEO và lãnh đạo doanh nghiệp Việt Nam.',
        color: '#8b5cf6',
    },
    {
        icon: Globe,
        title: 'Hanoi AI Tech Hub',
        desc: 'Trung tâm AI công nghệ kết nối startup Hà Nội với thị trường toàn cầu.',
        color: '#3b82f6',
    },
    {
        icon: Cpu,
        title: 'Laptop AI Review Platform',
        desc: 'Nền tảng đánh giá và tư vấn laptop AI hàng đầu Đông Nam Á.',
        color: '#06b6d4',
    },
    {
        icon: Shield,
        title: 'AI Security Infrastructure',
        desc: 'Hạ tầng bảo mật AI quốc gia cho doanh nghiệp và chính phủ.',
        color: '#10b981',
    },
];

function PotentialCard({
    card,
    delay,
}: {
    card: (typeof POTENTIAL_CARDS)[0];
    delay: number;
}) {
    const Icon = card.icon;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
            whileHover={{ scale: 1.04, y: -4 }}
            className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 flex flex-col gap-3 cursor-default transition-all duration-300"
            style={{
                boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
                '--glow': card.color,
            } as React.CSSProperties}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${card.color}22, 0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px ${card.color}25`;
                (e.currentTarget as HTMLElement).style.borderColor = `${card.color}30`;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
            }}
        >
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}
            >
                <Icon size={20} style={{ color: card.color }} />
            </div>
            <div>
                <p className="text-sm font-semibold text-white/85 mb-1">{card.title}</p>
                <p className="text-xs text-white/40 leading-relaxed">{card.desc}</p>
            </div>
        </motion.div>
    );
}

// ─── Overview tab content ─────────────────────────────────────────────────────
function OverviewContent({ result, fullResult }: { result: WhoisResult; fullResult?: DomainResult | null }) {
    const isHanoi = result.domain.toLowerCase() === 'hanoi.ceo';

    // Safely derive scores — prefer WhoisResult fields, fall back to DomainResult.aiAnalysis
    const ai = fullResult?.aiAnalysis;
    const domainScore = typeof result.score === 'number' && !isNaN(result.score)
        ? result.score
        : typeof ai?.overallScore === 'number' ? ai.overallScore : null;
    const aiFitScore = typeof result.aiFit === 'number' && !isNaN(result.aiFit)
        ? result.aiFit
        : typeof ai?.seoScore === 'number' ? ai.seoScore : null;
    const valueDisplay = result.valueEstimate ?? ai?.estimatedValue;
    const summaryDisplay = result.message ?? ai?.summary;

    return (
        <div className="space-y-4">
            {/* Score row */}
            <GlassCard glow="0 0 40px rgba(139,92,246,0.1)">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {domainScore !== null && <RadialScore score={domainScore} label="Domain Score" size={160} delay={0.2} />}
                    {aiFitScore !== null && <RadialScore score={aiFitScore} label="AI Fit" size={130} strokeWidth={9} delay={0.35} />}
                    <div className="flex-1 space-y-4">
                        {valueDisplay && (
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3">
                                <p className="text-xs text-white/40 mb-1">Giá trị ước tính</p>
                                <p className="text-xl font-black text-emerald-400" style={{ textShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
                                    {valueDisplay}
                                </p>
                            </div>
                        )}
                        {summaryDisplay && (
                            <p className="text-sm text-white/55 leading-relaxed">{summaryDisplay}</p>
                        )}
                        {result.error && (
                            <div className="text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                                ⚠ {result.error}
                            </div>
                        )}
                    </div>
                </div>
            </GlassCard>

            {/* ── WHOIS / RDAP full card ───────────────────────────── */}
            {fullResult && <WhoisCard result={fullResult} />}

            {/* Registration info (legacy WhoisResult fields for hanoi.ceo mock) */}
            {!fullResult && (result.registrar || result.createdDate || result.expiresDate) && (
                <GlassCard>
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={14} className="text-purple-400" />
                        <span className="text-sm font-semibold text-white/75">Thông tin đăng ký</span>
                    </div>
                    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                            { label: 'Registrar', value: result.registrar },
                            { label: 'Đăng ký', value: formatDate(result.createdDate) },
                            { label: 'Hết hạn', value: formatDate(result.expiresDate) },
                        ]
                            .filter((r) => r.value)
                            .map(({ label, value }) => (
                                <div key={label} className="bg-white/[0.03] rounded-xl px-3 py-2.5 border border-white/[0.05]">
                                    <dt className="text-[10px] text-white/35 mb-1">{label}</dt>
                                    <dd className="text-sm text-white/80 font-mono truncate">{value}</dd>
                                </div>
                            ))}
                    </dl>
                </GlassCard>
            )}

            {/* Nameservers — only show if no fullResult (WhoisCard handles it) */}
            {!fullResult && result.nameservers && result.nameservers.length > 0 && (
                <GlassCard>
                    <div className="flex items-center gap-2 mb-3">
                        <Server size={14} className="text-cyan-400" />
                        <span className="text-sm font-semibold text-white/75">Nameservers</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {result.nameservers.map((ns) => (
                            <span
                                key={ns}
                                className="text-xs font-mono text-white/55 bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5"
                            >
                                {ns}
                            </span>
                        ))}
                    </div>
                </GlassCard>
            )}

            {/* Special: hanoi.ceo potential */}
            {isHanoi && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.05] to-blue-500/[0.03] backdrop-blur-xl p-5"
                    style={{ boxShadow: '0 0 40px rgba(139,92,246,0.08)' }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Rocket size={15} className="text-purple-400" />
                        <span className="text-sm font-semibold text-white/85">Tiềm năng phát triển</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {POTENTIAL_CARDS.map((card, i) => (
                            <PotentialCard key={card.title} card={card} delay={0.25 + i * 0.08} />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* AI Analysis detail — shown for non-hanoi domains that have aiAnalysis */}
            {!isHanoi && ai && (
                <GlassCard>
                    <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit size={14} className="text-purple-400" />
                        <span className="text-sm font-semibold text-white/75">Phân tích AI</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ai.strengths?.length > 0 && (
                            <div>
                                <p className="text-[11px] font-semibold text-emerald-400 mb-2">✓ Điểm mạnh</p>
                                <ul className="space-y-1.5">
                                    {ai.strengths.map((s: string) => (
                                        <li key={s} className="text-xs text-white/55 leading-relaxed flex items-start gap-2">
                                            <span className="text-emerald-500 mt-0.5 flex-shrink-0">▸</span>{s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {ai.weaknesses?.length > 0 && (
                            <div>
                                <p className="text-[11px] font-semibold text-amber-400 mb-2">⚠ Hạn chế</p>
                                <ul className="space-y-1.5">
                                    {ai.weaknesses.map((s: string) => (
                                        <li key={s} className="text-xs text-white/55 leading-relaxed flex items-start gap-2">
                                            <span className="text-amber-500 mt-0.5 flex-shrink-0">▸</span>{s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {ai.useCases?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/[0.06]">
                            <p className="text-[11px] font-semibold text-cyan-400 mb-2">★ Use cases</p>
                            <div className="flex flex-wrap gap-1.5">
                                {ai.useCases.map((u: string) => (
                                    <span key={u} className="text-[10px] px-2 py-1 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/55">{u}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {ai.investmentRating && (
                        <p className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-purple-300 font-semibold">{ai.investmentRating}</p>
                    )}
                </GlassCard>
            )}

            {/* Similar Domains */}
            <SimilarDomains
                domains={fullResult?.similarDomains}
            />
        </div>
    );
}

// ─── Main ResultSection ───────────────────────────────────────────────────────
function ResultSection({ result }: { result: DomainResult | null }) {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    // Cast the full DomainResult to WhoisResult for sub-components that use the older type
    const whoisResult = result as WhoisResult | null;

    if (!result || !whoisResult) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={result.domain}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl mx-auto mt-8 space-y-4"
                id="pdf-export-target"
            >
                {/* ── Domain SVG header ────────────────────────────────────────── */}
                <div className="text-center mb-2">
                    <DomainSVG domain={result.domain} className="flex justify-center" />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="flex items-center justify-center gap-3 mt-2"
                    >
                        <StatusBadge status={result.status} />
                        {/* Export PDF button */}
                        <ExportPDF result={result} printTargetId="pdf-export-target" />
                    </motion.div>

                    {/* ── Premium Banner for hanoi.ceo ───────────────────────────── */}
                    {result.domain.toLowerCase() === 'hanoi.ceo' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 1.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-4 mx-auto max-w-md relative overflow-hidden rounded-2xl"
                        >
                            {/* Glow background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-cyan-500/20 blur-xl" />
                            <div
                                className="relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border border-amber-500/30"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(139,92,246,0.12) 50%, rgba(6,182,212,0.08) 100%)',
                                    boxShadow: '0 0 40px rgba(245,158,11,0.12), 0 0 80px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
                                }}
                            >
                                <span className="text-2xl">👑</span>
                                <div className="text-left">
                                    <p className="text-sm font-black tracking-wide">
                                        <span className="bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                            DOMAIN PREMIUM CAO CẤP
                                        </span>
                                    </p>
                                    <p className="text-[11px] text-white/45 mt-0.5">
                                        Dành riêng cho CEO & lãnh đạo doanh nghiệp đẳng cấp
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-1">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400">
                                        TOP 1%
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ── Tabs ─────────────────────────────────────────────────────── */}
                <div className="relative flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-1.5">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'relative flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 outline-none',
                                    active ? 'text-white' : 'text-white/40 hover:text-white/70'
                                )}
                            >
                                {active && (
                                    <motion.div
                                        layoutId="tab-bg"
                                        className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.10]"
                                        style={{ boxShadow: '0 0 20px rgba(139,92,246,0.15)' }}
                                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                )}
                                <Icon size={14} className="relative z-10" />
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Tab content ───────────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <OverviewContent result={whoisResult} fullResult={result} />
                        </motion.div>
                    )}
                    {activeTab === 'ai' && (
                        <motion.div
                            key="ai"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <LinkedAIServices domain={result.domain} special={whoisResult.special} />
                        </motion.div>
                    )}
                    {activeTab === 'laptops' && (
                        <motion.div
                            key="laptops"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <LaptopRecommendations />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}

export default memo(ResultSection);
