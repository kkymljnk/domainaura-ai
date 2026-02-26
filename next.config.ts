import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // ── Image Optimization ──────────────────────────────────────────────────────
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 86400,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
    },

    // ── Security & Performance Headers ──────────────────────────────────────────
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-DNS-Prefetch-Control', value: 'on' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
            {
                source: '/api/(.*)',
                headers: [
                    { key: 'Cache-Control', value: 'no-store, max-age=0' },
                ],
            },
        ];
    },

    // ── Experimental ─────────────────────────────────────────────────────────────
    experimental: {
        optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
    },
};

export default nextConfig;
