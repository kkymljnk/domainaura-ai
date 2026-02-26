# 🌐 DomainAura AI

> **Enterprise-ready domain intelligence platform** — Real-time WHOIS, AI-powered brand scoring, SEO analysis, and market value estimation. Built with Next.js 15, Three.js, Framer Motion.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/domainaura-ai)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Real WHOIS / RDAP** | Live domain lookup via RDAP global registry — no cache, no stale data |
| 🤖 **AI Analysis** | Brand score, memorability, SEO fit, rarity, trust score & investment rating |
| 📊 **Radial Score Charts** | Beautiful animated radial progress for each metric |
| 🖨️ **Export PDF** | One-click branded PDF export of full domain analysis (jsPDF + html2canvas) |
| 🌐 **Similar Domains** | 5 curated domain suggestions with availability + direct Porkbun register link |
| 🏆 **Trust Badges** | "Powered by Grok AI" · "Real WHOIS" · "Secure" — prominently displayed |
| 🌌 **3D Background** | Reactive Three.js + WebGL particle system that responds to search interactions |
| 🎊 **Confetti** | Canvas confetti celebration on successful domain lookup |
| 📱 **Responsive** | Mobile-first design with glassmorphism + neon aesthetics |
| 📈 **Vercel Analytics** | Production-ready analytics integrated in `layout.tsx` |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — type `hanoi.ceo` for the full demo.

---

## 🏗 Project Structure

```
domainaura-ai/
├── app/
│   ├── api/
│   │   ├── domain/route.ts       # Main RDAP domain lookup API
│   │   └── whois/route.ts        # WHOIS supplementary data
│   ├── globals.css               # Design system: neon, glass, gradients
│   ├── layout.tsx                # Root layout: SEO metadata, Analytics, Toaster
│   └── page.tsx                  # Homepage: hero, search, results
├── components/
│   ├── DomainInput.tsx           # Animated search input with scan-line effect
│   ├── DomainSVG.tsx             # Animated neon SVG domain name display
│   ├── ExportPDF.tsx             # PDF export button (jsPDF + html2canvas)
│   ├── LaptopRecommendations.tsx # AI laptop recommendations tab
│   ├── LinkedAIServices.tsx      # AI brand services tab
│   ├── RadialScore.tsx           # Animated radial progress score chart
│   ├── ResultSection.tsx         # Full result dashboard (tabs, export, similar)
│   ├── SimilarDomains.tsx        # Similar domain suggestions section
│   ├── ThreeBackground.tsx       # Reactive Three.js WebGL background
│   └── TrustBadges.tsx           # Grok AI / WHOIS / Secure trust badges
├── lib/
│   ├── mockData.ts               # Demo data for hanoi.ceo + DomainResult type
│   ├── threeStore.ts             # Shared state for 3D background reactivity
│   ├── types.ts                  # Shared TypeScript interfaces
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
├── next.config.ts                # Image optimization, security headers
├── vercel.json                   # Vercel deploy config (Singapore region)
└── README.md
```

---

## 🌐 API Routes

### `GET /api/domain?domain=hanoi.ceo`

Main analysis endpoint. Returns full `DomainResult` with AI scoring.

**Special case:** `hanoi.ceo` returns rich mock data with full AI analysis, similar domains, DNS records, and TLD info.

**For all other domains:** queries the RDAP global bootstrap registry (`https://rdap.org`), parses the response, generates synthetic AI scores, and returns a normalized result.

**Response shape:**
```typescript
interface DomainResult {
  domain: string;
  status: "registered" | "available" | "error" | "unknown";
  registrar?: string;
  createdDate?: string;
  expiresDate?: string;
  nameservers?: string[];
  aiAnalysis?: {
    brandScore: number;        // 0-100
    memorabilityScore: number;
    seoScore: number;
    trustScore: number;
    rarityScore: number;
    overallScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    useCases: string[];
    estimatedValue: string;
    investmentRating: string;
  };
  similarDomains?: {
    domain: string;
    status: "available" | "registered" | "unknown";
    price: string | null;
  }[];
}
```

---

## 🤖 Adding Real AI (Grok / OpenAI)

Currently the AI analysis uses algorithmic scoring. To connect a real LLM:

### Option A — Grok (xAI)

```typescript
// app/api/domain/route.ts
import OpenAI from 'openai'; // Grok uses OpenAI-compatible API

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

async function generateAIAnalysis(domain: string, rdapData: object) {
  const prompt = `
You are a domain intelligence expert. Analyze the domain "${domain}" and the following RDAP data:
${JSON.stringify(rdapData, null, 2)}

Return a JSON object with these exact fields:
{
  "brandScore": <0-100 brand strength based on name length, pronounceability, memorability>,
  "memorabilityScore": <0-100>,
  "seoScore": <0-100 based on keywords, TLD authority, search potential>,
  "trustScore": <0-100 based on TLD, registrar, age, DNSSEC>,
  "rarityScore": <0-100 how rare/premium this domain category is>,
  "overallScore": <weighted average>,
  "summary": "<2-3 sentence Vietnamese analysis>",
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", ...],
  "useCases": ["<use case 1>", ...],
  "estimatedValue": "<USD range estimate>",
  "investmentRating": "<X/5 stars with note>"
}`;

  const response = await client.chat.completions.create({
    model: 'grok-2-latest',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  return JSON.parse(response.choices[0].message.content ?? '{}');
}
```

Add to `.env.local`:
```env
XAI_API_KEY=xai-xxxxxxxxxxxx
```

### Option B — OpenAI (GPT-4o)

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Same function signature, just change:
// model: 'gpt-4o-mini'  (fast + cheap)
// model: 'gpt-4o'       (highest quality)
```

Add to `.env.local`:
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

### Prompt Engineering Tips

- Include the **full TLD** in the prompt (`.ceo`, `.ai`, `.tech` each carry different brand authority)
- Ask for **Vietnamese + English** switching in the summary for local relevance  
- Use `temperature: 0.2–0.4` for consistent, analytical responses
- Cache responses in Redis/Vercel KV to avoid re-scoring identical domains

---

## 🎨 Customization

### Color Palette
All colors are defined in `tailwind.config.js` and `globals.css`:
```css
/* Primary neon purple */     #8b5cf6
/* Secondary blue */          #3b82f6
/* Accent cyan */             #06b6d4
/* Background deep space */   #050510
```

### Adding a New Tab to ResultSection
1. Add entry to `TABS` array in `components/ResultSection.tsx`
2. Create a new `<motion.div>` block in the tab content `AnimatePresence`
3. Create a new component in `components/`

### Changing Similar Domain Suggestions
Edit `DEFAULT_DOMAINS` in `components/SimilarDomains.tsx`, or pass a `domains` prop from the API response (`similarDomains` field in `DomainResult`).

---

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

The `vercel.json` is already configured with:
- **Region:** `sin1` (Singapore — lowest latency for Vietnam)
- **API caching:** disabled (real-time WHOIS requires fresh data)
- **Static assets:** immutable caching (1 year)

### Environment Variables on Vercel

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | ✅ | Your production URL (e.g. `https://domainaura.ai`) |
| `XAI_API_KEY` | Optional | Grok AI API key for real analysis |
| `OPENAI_API_KEY` | Optional | OpenAI API key (alternative) |

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| 3D Graphics | Three.js + @react-three/fiber |
| Animation | Framer Motion 11 |
| Styling | TailwindCSS 3 + vanilla CSS |
| Icons | Lucide React |
| Charts | Recharts + custom SVG radials |
| Notifications | Sonner |
| PDF Export | jsPDF + html2canvas |
| Analytics | Vercel Analytics |
| Domain Data | RDAP (rdap.org) + WHOIS |
| Confetti | canvas-confetti |

---

## 📄 License

MIT © 2026 DomainAura AI · [hanoi.ceo](https://hanoi.ceo)
