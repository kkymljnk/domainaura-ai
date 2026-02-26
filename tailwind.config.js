/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
            },
            colors: {
                neon: {
                    purple: '#b537f2',
                    blue: '#3b82f6',
                    cyan: '#06b6d4',
                    pink: '#ec4899',
                    green: '#10b981',
                },
            },
            backgroundImage: {
                'neon-gradient': 'linear-gradient(135deg, #0d001a 0%, #050014 40%, #000a1f 70%, #000510 100%)',
                'card-glass': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
            },
            boxShadow: {
                'neon-purple': '0 0 20px rgba(181, 55, 242, 0.4), 0 0 60px rgba(181, 55, 242, 0.15)',
                'neon-blue': '0 0 20px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.15)',
                'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.4), 0 0 60px rgba(6, 182, 212, 0.15)',
                'neon-input': '0 0 30px rgba(181, 55, 242, 0.3), 0 0 80px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
            },
            animation: {
                'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'scan': 'scan 3s linear infinite',
                'glitch': 'glitch 0.3s ease-in-out',
            },
            keyframes: {
                'pulse-neon': {
                    '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
                    '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                scan: {
                    '0%': { top: '0%' },
                    '100%': { top: '100%' },
                },
                glitch: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%': { transform: 'translateX(-3px) skewX(-2deg)' },
                    '40%': { transform: 'translateX(3px) skewX(2deg)' },
                    '60%': { transform: 'translateX(-2px)' },
                    '80%': { transform: 'translateX(2px)' },
                },
            },
        },
    },
    plugins: [],
};
