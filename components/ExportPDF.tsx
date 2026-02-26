'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DomainResult } from '@/lib/mockData';

interface ExportPDFProps {
    result: DomainResult;
    printTargetId?: string;
    className?: string;
}

type ExportState = 'idle' | 'loading' | 'success' | 'error';

export default function ExportPDF({ result, printTargetId = 'pdf-export-target', className }: ExportPDFProps) {
    const [state, setState] = useState<ExportState>('idle');

    const handleExport = useCallback(async () => {
        if (state === 'loading') return;
        setState('loading');

        try {
            // Dynamically import to avoid SSR issues with jsPDF / html2canvas
            const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
                import('jspdf'),
                import('html2canvas'),
            ]);

            const target = document.getElementById(printTargetId);
            if (!target) {
                console.warn(`[ExportPDF] Target element #${printTargetId} not found — falling back to window.print()`);
                window.print();
                setState('success');
                setTimeout(() => setState('idle'), 2500);
                return;
            }

            // Capture the element
            const canvas = await html2canvas(target, {
                backgroundColor: '#050510',
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: false,
                foreignObjectRendering: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true,
            });

            const pageWidth = pdf.internal.pageSize.getWidth();   // 210mm
            const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
            const margin = 10;
            const usableWidth = pageWidth - 2 * margin;
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;
            const pdfImgWidth = usableWidth;
            const pdfImgHeight = pdfImgWidth / ratio;

            // Header bar
            pdf.setFillColor(5, 5, 16);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');

            // Watermark / branding strip
            pdf.setFillColor(15, 10, 35);
            pdf.rect(0, 0, pageWidth, 14, 'F');
            pdf.setTextColor(192, 132, 252);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            pdf.text('DomainAura AI · domain intelligence report', margin, 9);
            pdf.setTextColor(100, 100, 140);
            pdf.setFont('helvetica', 'normal');
            pdf.text(
                `${result.domain.toUpperCase()} · Generated ${new Date().toLocaleDateString('vi-VN')}`,
                pageWidth - margin,
                9,
                { align: 'right' }
            );

            // Image — handle multi-page if content is tall
            const contentOffsetY = 16;
            const availableHeight = pageHeight - contentOffsetY - margin;

            if (pdfImgHeight <= availableHeight) {
                pdf.addImage(imgData, 'PNG', margin, contentOffsetY, pdfImgWidth, pdfImgHeight);
            } else {
                // Slice across pages
                const sliceRatio = availableHeight / pdfImgHeight;
                let remainingRatio = 1;
                let page = 0;
                while (remainingRatio > 0) {
                    const yOffset = page === 0 ? contentOffsetY : 10;
                    const scaledPdfH = pdfImgHeight * (page === 0 ? sliceRatio : Math.min(sliceRatio, remainingRatio));
                    pdf.addImage(
                        imgData,
                        'PNG',
                        margin,
                        yOffset - pdfImgHeight * (1 - remainingRatio),
                        pdfImgWidth,
                        pdfImgHeight
                    );
                    remainingRatio -= sliceRatio;
                    page++;
                    if (remainingRatio > 0) pdf.addPage();
                }
            }

            // Footer
            pdf.setFillColor(10, 8, 25);
            pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
            pdf.setTextColor(80, 70, 110);
            pdf.setFontSize(7);
            pdf.text('Powered by Grok AI · Real WHOIS · © 2026 DomainAura AI · hanoi.ceo', pageWidth / 2, pageHeight - 3.5, { align: 'center' });

            pdf.save(`domainaura-${result.domain}-${Date.now()}.pdf`);

            setState('success');
            setTimeout(() => setState('idle'), 2500);
        } catch (err) {
            console.error('[ExportPDF] Error:', err);
            setState('error');
            setTimeout(() => setState('idle'), 2500);
        }
    }, [state, result, printTargetId]);

    const labels: Record<ExportState, string> = {
        idle: 'Export PDF',
        loading: 'Đang tạo...',
        success: 'Đã lưu!',
        error: 'Thử lại',
    };

    return (
        <motion.button
            onClick={handleExport}
            disabled={state === 'loading'}
            whileHover={{ scale: state === 'loading' ? 1 : 1.04 }}
            whileTap={{ scale: state === 'loading' ? 1 : 0.97 }}
            className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold',
                'border transition-all duration-200 outline-none overflow-hidden',
                state === 'success'
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : state === 'error'
                        ? 'border-red-500/40 bg-red-500/10 text-red-400'
                        : 'border-white/10 bg-white/[0.04] text-white/60 hover:text-white hover:border-purple-500/40 hover:bg-purple-500/10',
                'disabled:cursor-not-allowed',
                className
            )}
            aria-label="Export domain analysis as PDF"
            id="export-pdf-btn"
        >
            {/* Shimmer effect on loading */}
            <AnimatePresence>
                {state === 'loading' && (
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {state === 'loading' ? (
                    <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <Loader2 size={13} className="animate-spin" />
                        {labels.loading}
                    </motion.span>
                ) : state === 'success' ? (
                    <motion.span key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <CheckCircle size={13} />
                        {labels.success}
                    </motion.span>
                ) : (
                    <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <Download size={13} />
                        {labels[state]}
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
