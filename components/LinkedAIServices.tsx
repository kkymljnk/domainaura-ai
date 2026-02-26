'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Data ─────────────────────────────────────────────────────────────────────
interface AIBrand {
    name: string;
    slug: string;
    accent: string;
    description: string;
}

const AI_BRANDS: AIBrand[] = [
    { name: 'OpenAI', slug: 'openai', accent: '#10b981', description: 'GPT-4o · ChatGPT Enterprise' },
    { name: 'Google DeepMind', slug: 'google', accent: '#4285f4', description: 'Gemini Pro · Vertex AI' },
    { name: 'Anthropic', slug: 'anthropic', accent: '#d97706', description: 'Claude 3.5 · Enterprise API' },
    { name: 'Microsoft AI', slug: 'microsoft', accent: '#00a4ef', description: 'Copilot · Azure OpenAI' },
    { name: 'NVIDIA AI', slug: 'nvidia', accent: '#76b900', description: 'NIM · CUDA · AI Supercomputing' },
    { name: 'Meta AI', slug: 'meta', accent: '#0866ff', description: 'Llama 3 · Meta AI Platform' },
    { name: 'xAI (Grok)', slug: 'x', accent: '#e2e8f0', description: 'Grok · xAI API' },
];

const HANOI_LINKED_NAMES = ['OpenAI', 'NVIDIA AI', 'Microsoft AI'];

const SPECIAL_SERVICES = [
    {
        name: 'OpenAI Enterprise',
        linked: true,
        slug: 'openai',
        note: null,
    },
    {
        name: 'ChatGPT Business',
        linked: false,
        slug: 'openai',
        note: 'CHATGPT BUSINESS HIỆN TẠI KHÔNG ĐƯỢC LIÊN KẾT. VUI LÒNG LIÊN KẾT VÀ THÊM THÀNH VIÊN.',
    },
    {
        name: 'Malwarebytes Premium',
        linked: false,
        slug: 'malwarebytes',
        note: 'NÂNG CẤP GÓI BUSINESS ĐỂ LIÊN KẾT VỚI DOMAIN HIỆN TẠI.',
    },
];

// ─── Logo with fallback ────────────────────────────────────────────────────────
function BrandLogo({ slug, name, size = 28 }: { slug: string; name: string; size?: number }) {
    const [failed, setFailed] = useState(false);
    const initials = name.slice(0, 2).toUpperCase();

    if (failed) {
        return (
            <div
                className="rounded-md bg-white/10 flex items-center justify-center text-white/60 font-bold text-xs flex-shrink-0"
                style={{ width: size, height: size }}
            >
                {initials}
            </div>
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
            className="flex-shrink-0 object-contain"
            style={{ width: size, height: size, opacity: 0.85 }}
        />
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ linked }: { linked: boolean }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border flex-shrink-0',
                linked
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/25'
            )}
            style={
                linked
                    ? { boxShadow: '0 0 10px rgba(16,185,129,0.2)' }
                    : { boxShadow: '0 0 10px rgba(245,158,11,0.15)' }
            }
        >
            {linked ? <CheckCircle size={9} /> : <AlertTriangle size={9} />}
            {linked ? 'Linked' : 'Not Linked'}
        </span>
    );
}

// ─── Brand Card ───────────────────────────────────────────────────────────────
function BrandCard({
    brand,
    linked,
    delay,
}: {
    brand: AIBrand;
    linked: boolean;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
            whileHover={{ scale: 1.03, y: -2 }}
            className={cn(
                'relative rounded-xl border p-4 flex flex-col gap-3 transition-all duration-300 cursor-default',
                'bg-white/[0.03] backdrop-blur-sm',
                linked
                    ? 'border-emerald-500/20 hover:border-emerald-500/40'
                    : 'border-white/[0.06] hover:border-white/[0.12]'
            )}
            style={
                linked
                    ? { boxShadow: '0 0 24px rgba(16,185,129,0.07), 0 4px 16px rgba(0,0,0,0.3)' }
                    : { boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }
            }
        >
            {linked && (
                <div className="absolute top-2 right-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
            )}
            <div className="flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${brand.accent}12`, border: `1px solid ${brand.accent}25` }}
                >
                    <BrandLogo slug={brand.slug} name={brand.name} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white/85 truncate">{brand.name}</p>
                    <p className="text-[10px] text-white/35 truncate mt-0.5">{brand.description}</p>
                </div>
            </div>
            <StatusBadge linked={linked} />
        </motion.div>
    );
}

// ─── Special service item (hanoi.ceo) ─────────────────────────────────────────
function SpecialServiceItem({
    item,
    delay,
}: {
    item: (typeof SPECIAL_SERVICES)[0];
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay }}
            className={cn(
                'flex items-start gap-3 p-3.5 rounded-xl border',
                item.linked
                    ? 'bg-emerald-500/[0.05] border-emerald-500/20'
                    : 'bg-white/[0.02] border-white/[0.06]'
            )}
        >
            <div className="mt-0.5">
                <BrandLogo slug={item.slug} name={item.name} size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white/80">{item.name}</span>
                    <StatusBadge linked={item.linked} />
                </div>
                {item.note && (
                    <p className="mt-1 text-[10px] text-amber-400/60 font-mono leading-relaxed tracking-wide">
                        {item.note}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

// ─── Main: LinkedAIServices ───────────────────────────────────────────────────
interface LinkedAIServicesProps {
    domain: string;
    special?: boolean;
}

function LinkedAIServices({ domain, special }: LinkedAIServicesProps) {
    const isHanoi = domain.toLowerCase() === 'hanoi.ceo';

    const brandsWithStatus = AI_BRANDS.map((b) => ({
        ...b,
        linked: isHanoi
            ? HANOI_LINKED_NAMES.includes(b.name)
            : Math.random() > 0.65, // random for other domains
    }));

    return (
        <div className="space-y-5">
            {/* ── AI Brand grid ─────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-5"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Zap size={15} className="text-purple-400" />
                    <span className="text-sm font-semibold text-white/80">
                        AI &amp; Công nghệ liên kết với Domain
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {brandsWithStatus.map((b, i) => (
                        <BrandCard key={b.name} brand={b} linked={b.linked} delay={0.05 * i} />
                    ))}
                </div>
            </motion.div>

            {/* ── Special: hanoi.ceo recommended services ────────────────────── */}
            {(isHanoi || special) && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.03] backdrop-blur-xl p-5"
                    style={{ boxShadow: '0 0 30px rgba(139,92,246,0.06)' }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                        <span className="text-sm font-semibold text-white/80">
                            AI Được đề xuất cho Domain này
                        </span>
                        <span className="ml-auto text-[10px] text-purple-400/60 font-mono bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                            hanoi.ceo
                        </span>
                    </div>

                    <div className="space-y-2.5">
                        {SPECIAL_SERVICES.map((item, i) => (
                            <SpecialServiceItem key={item.name} item={item} delay={0.2 + i * 0.07} />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default memo(LinkedAIServices);
