'use client';

import { useState, useRef, useCallback, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Zap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { threeStore } from '@/lib/threeStore';
import type { DomainResult } from '@/lib/mockData';
import confetti from 'canvas-confetti';

interface DomainInputProps {
    onResult: (result: DomainResult | null) => void;
    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
}

function fireConfetti() {
    const count = 220;
    const defaults = { origin: { y: 0.6 }, zIndex: 9999 };
    const fire = (pOpts: confetti.Options) =>
        confetti({ ...defaults, ...pOpts });

    fire({
        particleCount: Math.floor(count * 0.25),
        spread: 26,
        startVelocity: 55,
        colors: ['#8b5cf6', '#3b82f6', '#06b6d4'],
    });
    fire({
        particleCount: Math.floor(count * 0.2),
        spread: 60,
        colors: ['#a855f7', '#60a5fa', '#22d3ee'],
    });
    fire({
        particleCount: Math.floor(count * 0.35),
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        colors: ['#8b5cf6', '#06b6d4', '#3b82f6'],
    });
    fire({
        particleCount: Math.floor(count * 0.1),
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        colors: ['#a855f7', '#60a5fa'],
    });
    fire({
        particleCount: Math.floor(count * 0.1),
        spread: 160,
        startVelocity: 45,
        colors: ['#8b5cf6', '#22d3ee'],
    });
}

function DomainInput({ onResult, isLoading, setIsLoading }: DomainInputProps) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = useCallback(() => {
        setFocused(true);
        threeStore.inputFocused = true;
    }, []);

    const handleBlur = useCallback(() => {
        setFocused(false);
        threeStore.inputFocused = false;
    }, []);

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();
            const domain = value.trim().toLowerCase();
            if (!domain) {
                setError('Nhập tên domain để phân tích');
                return;
            }
            const regex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
            if (!regex.test(domain)) {
                setError('Domain không hợp lệ. Ví dụ: hanoi.ceo, startup.ai');
                return;
            }
            setError('');
            setIsLoading(true);
            onResult(null);
            threeStore.isSubmitting = true;
            threeStore.isSuccess = false;

            try {
                const res = await fetch(`/api/domain?domain=${encodeURIComponent(domain)}`);
                const data: DomainResult = await res.json();
                threeStore.isSubmitting = false;
                threeStore.isSuccess = true;
                onResult(data);
                fireConfetti();
                setTimeout(() => {
                    threeStore.isSuccess = false;
                }, 3000);
            } catch {
                threeStore.isSubmitting = false;
                threeStore.isSuccess = false;
                setError('Lỗi kết nối. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        },
        [value, setIsLoading, onResult]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleSubmit();
        },
        [handleSubmit]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto"
        >
            <form onSubmit={handleSubmit} className="relative">
                {/* Glow ring behind input */}
                <motion.div
                    animate={{
                        opacity: focused ? 1 : 0,
                        scale: focused ? 1 : 0.95,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute -inset-[3px] rounded-2xl bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 blur-md opacity-70 pointer-events-none"
                />

                {/* Input container */}
                <div
                    className={cn(
                        'relative flex items-center rounded-2xl overflow-hidden transition-all duration-300',
                        'bg-white/[0.04] backdrop-blur-xl border',
                        focused
                            ? 'border-purple-500/60 shadow-neon-input'
                            : 'border-white/10 shadow-glass'
                    )}
                >
                    {/* Icon */}
                    <div className="pl-5 pr-1 flex-shrink-0">
                        <motion.div
                            animate={{ color: focused ? '#8b5cf6' : '#6b7280' }}
                            transition={{ duration: 0.3 }}
                        >
                            <Globe size={22} />
                        </motion.div>
                    </div>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        id="domain-input"
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder="Nhập domain... (vd: startup.ai)"
                        disabled={isLoading}
                        autoComplete="off"
                        spellCheck={false}
                        className={cn(
                            'flex-1 bg-transparent py-5 px-3 text-lg text-white placeholder-white/25',
                            'font-mono outline-none tracking-wide',
                            'disabled:opacity-50 disabled:cursor-not-allowed'
                        )}
                    />

                    {/* Scan line animation when focused */}
                    <AnimatePresence>
                        {focused && (
                            <motion.div
                                initial={{ top: 0, opacity: 0.6 }}
                                animate={{ top: '100%', opacity: 0 }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: 'linear-gradient(90deg, transparent, #8b5cf6, #06b6d4, transparent)',
                                }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Submit button */}
                    <div className="pr-2 flex-shrink-0">
                        <motion.button
                            type="submit"
                            disabled={isLoading || !value.trim()}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className={cn(
                                'flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm',
                                'transition-all duration-200 outline-none focus:ring-2 focus:ring-purple-500/50',
                                'disabled:opacity-40 disabled:cursor-not-allowed',
                                'bg-gradient-to-r from-purple-600 to-blue-600',
                                'hover:from-purple-500 hover:to-blue-500',
                                'text-white shadow-neon-purple'
                            )}
                        >
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.span
                                        key="loading"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="hidden sm:inline">Đang phân tích...</span>
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="idle"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Zap size={16} />
                                        <span className="hidden sm:inline">Phân tích ngay</span>
                                        <span className="sm:hidden">GO</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </form>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-3 text-center text-sm text-red-400/90 font-medium"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Hint hidden per user request */}
        </motion.div>
    );
}

export default memo(DomainInput);
