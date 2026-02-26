'use client';

import { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Server,
    Globe,
    Shield,
    Copy,
    Check,
    Clock,
    Building2,
    Tag,
    Info,
    ExternalLink,
    Lock,
    Unlock,
    AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DomainResult } from '@/lib/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(s?: string): string | null {
    if (!s) return null;
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function daysUntil(s?: string): number | null {
    if (!s) return null;
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return Math.ceil((d.getTime() - Date.now()) / 86_400_000);
}

function daysSince(s?: string): number | null {
    if (!s) return null;
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return Math.floor((Date.now() - d.getTime()) / 86_400_000);
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        });
    }, [text]);

    return (
        <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.85 }}
            className="ml-1 text-white/25 hover:text-purple-400 transition-colors"
            aria-label="Copy"
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Check size={11} className="text-emerald-400" />
                    </motion.span>
                ) : (
                    <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <Copy size={11} />
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}

// ─── Grid Item Component ───────────────────────────────────────────────────────
function GridBlock({
    icon: Icon,
    label,
    value,
    color = '#8b5cf6',
    mono = false,
    extra,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    color?: string;
    mono?: boolean;
    extra?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Icon size={12} style={{ color }} />
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{label}</span>
                </div>
            </div>
            <div className={cn('text-sm text-white/85 break-all', mono && 'font-mono text-xs text-white/70')}>
                {value}
            </div>
            {extra && <div className="mt-1">{extra}</div>}
        </div>
    );
}

// ─── Badges ───────────────────────────────────────────────────────────────────
function StatusList({ statuses }: { statuses?: string[] }) {
    if (!statuses?.length) return <span className="text-white/50 text-sm">—</span>;
    return (
        <div className="flex flex-wrap gap-1.5 mt-1">
            {statuses.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    {s}
                </span>
            ))}
        </div>
    );
}

function ExpiryBadge({ date }: { date?: string }) {
    const days = daysUntil(date);
    if (days === null) return null;
    const urgent = days < 30;
    const soon = days < 90;
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border',
                urgent
                    ? 'text-red-400 border-red-500/30 bg-red-500/10'
                    : soon
                        ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                        : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
            )}
        >
            {urgent ? <AlertTriangle size={9} /> : <Clock size={9} />}
            {days > 0 ? `Còn ${days} ngày` : `Đã hết hạn ${Math.abs(days)} ngày trước`}
        </span>
    );
}

function AgeBadge({ date }: { date?: string }) {
    const days = daysSince(date);
    if (days === null) return null;
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const label = years > 0 ? `${years} năm ${months > 0 ? `${months} tháng` : ''} tuổi` : `${months} tháng tuổi`;
    return (
        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border text-blue-400 border-blue-500/30 bg-blue-500/10">
            <Clock size={9} /> {label}
        </span>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface WhoisCardProps {
    result: DomainResult;
    className?: string;
}

function WhoisCard({ result, className }: WhoisCardProps) {
    const hasWhois =
        result.registrar ||
        result.createdDate ||
        result.expiresDate ||
        result.nameservers?.length ||
        result.dnssec ||
        result.whoisServer ||
        result.tldInfo;

    if (!hasWhois) return null;

    const rdapStatuses: string[] = Array.isArray((result.rawRdap as Record<string, unknown> | undefined)?.status)
        ? ((result.rawRdap as Record<string, unknown>).status as string[])
        : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                'rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-gradient-to-r from-white/[0.04] to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                        <Globe size={16} className="text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white/90">Thông tin WHOIS & RDAP</h3>
                        <p className="text-xs text-white/40 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                            Dữ liệu trực tiếp từ Registry
                        </p>
                    </div>
                </div>
                {result.whoisServer && (
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] uppercase font-semibold text-white/30 tracking-wider">WHOIS SERVER</span>
                        <span className="text-xs font-mono text-white/50">{result.whoisServer}</span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column: Dates & Registry */}
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-widest pl-1 mb-2 flex items-center gap-1.5">
                            <Calendar size={12} /> Đăng ký & Thời hạn
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                            {result.createdDate && (
                                <GridBlock
                                    icon={Calendar}
                                    label="Ngày đăng ký"
                                    color="#06b6d4"
                                    value={formatDate(result.createdDate)}
                                    extra={<AgeBadge date={result.createdDate} />}
                                />
                            )}
                            {result.expiresDate && (
                                <GridBlock
                                    icon={Calendar}
                                    label="Ngày hết hạn"
                                    color="#f59e0b"
                                    value={formatDate(result.expiresDate)}
                                    extra={<ExpiryBadge date={result.expiresDate} />}
                                />
                            )}
                        </div>

                        {result.registrar && (
                            <GridBlock
                                icon={Building2}
                                label="Nhà đăng ký (Registrar)"
                                color="#8b5cf6"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span>{result.registrar}</span>
                                        {result.registrarUrl && (
                                            <a href={result.registrarUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors">
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                }
                            />
                        )}

                        {result.updatedDate && (
                            <GridBlock
                                icon={Clock}
                                label="Cập nhật lần cuối"
                                color="#6366f1"
                                value={formatDate(result.updatedDate)}
                            />
                        )}
                    </div>

                    {/* Right Column: Technical & Nameservers */}
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-semibold text-white/50 uppercase tracking-widest pl-1 mb-2 flex items-center gap-1.5">
                            <Server size={12} /> Kỹ thuật & Hạ tầng
                        </h4>

                        {result.nameservers && result.nameservers.length > 0 && (
                            <GridBlock
                                icon={Server}
                                label={`Nameservers (${result.nameservers.length})`}
                                color="#3b82f6"
                                mono
                                value={
                                    <div className="space-y-2 mt-1">
                                        {result.nameservers.map((ns) => (
                                            <div key={ns} className="flex items-center justify-between group rounded bg-white/[0.02] p-1.5 border border-white/[0.03]">
                                                <span className="text-blue-400/90 truncate mr-2">{ns.toLowerCase()}</span>
                                                <CopyBtn text={ns.toLowerCase()} />
                                            </div>
                                        ))}
                                    </div>
                                }
                            />
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {result.dnssec && (
                                <GridBlock
                                    icon={result.dnssec === 'signed' ? Lock : Unlock}
                                    label="DNSSEC"
                                    color={result.dnssec === 'signed' ? '#10b981' : '#f59e0b'}
                                    value={
                                        <span className={cn('text-xs font-semibold', result.dnssec === 'signed' ? 'text-emerald-400' : 'text-amber-400')}>
                                            {result.dnssec === 'signed' ? 'Đã ký (Bảo mật)' : 'Chưa ký'}
                                        </span>
                                    }
                                />
                            )}
                            {result.extension && (
                                <GridBlock
                                    icon={Tag}
                                    label="TLD"
                                    color="#a855f7"
                                    mono
                                    value={<span className="text-purple-300 font-bold">{result.extension}</span>}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Full Width Footer elements */}
                {(result.registrant || rdapStatuses.length > 0 || result.tldInfo) && (
                    <div className="mt-5 pt-5 border-t border-white/[0.05] grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.registrant && (result.registrant.organization || result.registrant.country || result.registrant.name) && (
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                                    <Shield size={10} /> Thông tin chủ thể (Registrant)
                                </h4>
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                    {result.registrant.organization && <p className="text-sm font-semibold text-white/85 mb-1">{result.registrant.organization}</p>}
                                    {result.registrant.name && <p className="text-xs text-white/55">{result.registrant.name}</p>}
                                    {result.registrant.country && <p className="text-[10px] mt-2 inline-flex border border-white/10 px-2 py-0.5 rounded bg-white/5 font-mono text-white/50">Quốc gia: {result.registrant.country}</p>}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {result.tldInfo && (
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                        <Globe size={10} /> Chi tiết TLD
                                    </h4>
                                    <div className="p-3 rounded-xl bg-cyan-500/[0.02] border border-cyan-500/10">
                                        <p className="text-sm text-cyan-500/80 font-medium mb-1">{result.tldInfo.type}</p>
                                        <p className="text-xs text-white/50 leading-relaxed">{result.tldInfo.purpose}</p>
                                    </div>
                                </div>
                            )}

                            {rdapStatuses.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5">Trạng thái (Status Codes)</h4>
                                    <StatusList statuses={rdapStatuses} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Raw RDAP toggle */}
            {result.rawRdap && (
                <div className="px-5 pb-4">
                    <RawViewer raw={result.rawRdap} />
                </div>
            )}
        </motion.div>
    );
}

function RawViewer({ raw }: { raw?: Record<string, unknown> }) {
    const [open, setOpen] = useState(false);
    if (!raw) return null;
    return (
        <div className="mt-2 border-t border-white/[0.04] pt-4">
            <button
                onClick={() => setOpen((v) => !v)}
                className="text-[10px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5 mx-auto"
            >
                <Info size={10} />
                {open ? 'Ẩn dữ liệu thô (Raw RDAP)' : 'Xem dữ liệu thô (Raw RDAP)'}
            </button>
            <AnimatePresence>
                {open && (
                    <motion.pre
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 text-[10px] font-mono text-white/40 bg-[#0a0a0a] border border-white/[0.05] rounded-xl p-4 overflow-auto max-h-60 leading-relaxed shadow-inner"
                    >
                        {JSON.stringify(raw, null, 2)}
                    </motion.pre>
                )}
            </AnimatePresence>
        </div>
    );
}

export default memo(WhoisCard);
