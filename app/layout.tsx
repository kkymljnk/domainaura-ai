import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

// ── SEO Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    metadataBase: new URL('https://domainaura.ai'),
    title: {
        default: 'DomainAura AI — CEO · AI · Tech Domain Intelligence',
        template: '%s | DomainAura AI',
    },
    description:
        'Phân tích domain thông minh với AI. Đánh giá thương hiệu, SEO, độ hiếm, giá trị thị trường và hơn thế nữa. Powered by Grok AI & RDAP real-time data.',
    keywords: [
        'domain intelligence',
        'domain analysis',
        'AI domain checker',
        'domain checker',
        'WHOIS lookup',
        'hanoi.ceo',
        'domain value estimator',
        'brand score',
        'Grok AI',
        'RDAP',
    ],
    authors: [{ name: 'DomainAura AI', url: 'https://domainaura.ai' }],
    creator: 'DomainAura AI',
    publisher: 'DomainAura AI',
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },

    // ── Open Graph ──────────────────────────────────────────────────────────────
    openGraph: {
        title: 'DomainAura AI — Domain Intelligence Platform',
        description:
            'Phân tích domain thông minh với AI. Brand score, SEO, WHOIS real-time, giá trị thị trường và hơn thế nữa.',
        url: 'https://domainaura.ai',
        siteName: 'DomainAura AI',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'DomainAura AI — CEO · AI · Tech Domain Intelligence',
            },
        ],
    },

    // ── Twitter Card ────────────────────────────────────────────────────────────
    twitter: {
        card: 'summary_large_image',
        title: 'DomainAura AI — Domain Intelligence Platform',
        description: 'Phân tích domain thông minh với AI. Powered by Grok AI & RDAP.',
        images: ['/og-image.png'],
    },

    // ── PWA / App ────────────────────────────────────────────────────────────────
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    themeColor: '#050510',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi" className="dark">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#050510" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* JSON-LD structured data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebApplication',
                            name: 'DomainAura AI',
                            url: 'https://domainaura.ai',
                            description:
                                'AI-powered domain intelligence platform. Real-time WHOIS, brand score, SEO analysis, and market value estimation.',
                            applicationCategory: 'BusinessApplication',
                            operatingSystem: 'Web',
                            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                        }),
                    }}
                />
            </head>
            <body className="min-h-screen bg-[#050510] antialiased">
                {children}
                {/* ── Vercel Analytics ──────────────────────────────────────────── */}
                <Analytics />
                {/* ── Vercel Speed Insights ─────────────────────────────────────── */}
                <SpeedInsights />
                {/* ── Toast notifications ───────────────────────────────────────── */}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: 'rgba(15, 10, 30, 0.95)',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            color: '#fff',
                            backdropFilter: 'blur(20px)',
                            fontSize: '13px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(139,92,246,0.1)',
                        },
                    }}
                    theme="dark"
                />
            </body>
        </html>
    );
}
