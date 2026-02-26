import { NextRequest, NextResponse } from 'next/server';
import type { WhoisResult } from '@/lib/types';

const HANOI_CEO_MOCK: WhoisResult = {
    domain: 'hanoi.ceo',
    status: 'Registered',
    valueEstimate: '$85,000 – $168,000',
    aiFit: 100,
    score: 99,
    special: true,
    message:
        'hanoi.ceo là một domain cực kỳ cao cấp và hiếm có. Kết hợp giữa thành phố thủ đô năng động nhất Việt Nam với TLD .ceo dành riêng cho lãnh đạo doanh nghiệp. Domain này có giá trị thương hiệu xuất sắc, phù hợp cho AI & Computer CEO, founder công nghệ, hoặc bất kỳ lãnh đạo doanh nghiệp nào muốn khẳng định vị thế đẳng cấp.',
    linkedServices: [{ name: 'ChatGPT Enterprise', status: 'linked' }],
    unlinkedServices: [
        {
            name: 'ChatGPT Business',
            note: 'CHATGPT BUSINESS HIỆN TẠI KHÔNG ĐƯỢC LIÊN KẾT. VUI LÒNG LIÊN KẾT VÀ THÊM THÀNH VIÊN.',
        },
        {
            name: 'Malwarebytes Premium',
            note: 'NÂNG CẤP GÓI BUSINESS ĐỂ LIÊN KẾT VỚI DOMAIN HIỆN TẠI.',
        },
    ],
    registrar: 'Porkbun LLC',
    createdDate: '2022-09-14',
    expiresDate: '2050-02-26',
    nameservers: ['ns1.porkbun.com', 'ns2.porkbun.com'],
};

function estimateValue(name: string, score: number): string {
    const base = (score - 80) * 40 + name.length * 30;
    return `$${Math.max(300, base).toLocaleString()} – $${Math.max(1500, base * 4).toLocaleString()}`;
}

export async function POST(request: NextRequest) {
    let body: { domain?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const domain = (body.domain ?? '').toLowerCase().trim();
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/;

    if (!domain || !domainRegex.test(domain)) {
        return NextResponse.json({ error: 'Domain không hợp lệ. Ví dụ: hanoi.ceo' }, { status: 400 });
    }

    // ── Special: hanoi.ceo ─────────────────────────────────────────────────────
    if (domain === 'hanoi.ceo') {
        await new Promise((r) => setTimeout(r, 1600));
        return NextResponse.json(HANOI_CEO_MOCK);
    }

    // ── Real WHOIS via whoiser ─────────────────────────────────────────────────
    try {
        // Dynamically import to avoid Edge runtime issues
        const whoiser = (await import('whoiser')).default;

        const timeoutMs = 8000;
        const whoisPromise = whoiser(domain, { timeout: timeoutMs - 500, raw: false });

        const raw = await Promise.race([
            whoisPromise,
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('WHOIS timed out')), timeoutMs)
            ),
        ]);

        const score = 82 + Math.floor(Math.random() * 15);
        const aiFit = 70 + Math.floor(Math.random() * 26);
        const name = domain.split('.')[0];

        const firstServer = Object.values(raw as Record<string, unknown>)[0] as
            | Record<string, unknown>
            | undefined;

        const pick = (key: string) => {
            const v = firstServer?.[key];
            return Array.isArray(v) ? (v[0] as string) : typeof v === 'string' ? v : undefined;
        };

        const result: WhoisResult = {
            domain,
            status: pick('Domain Status') ? 'Registered' : 'Unknown',
            score,
            aiFit,
            valueEstimate: estimateValue(name, score),
            registrar: pick('Registrar') ?? pick('Registrar Name'),
            createdDate: pick('Created Date') ?? pick('Creation Date'),
            expiresDate: pick('Registry Expiry Date') ?? pick('Expiry Date'),
            nameservers:
                firstServer?.['Name Server'] != null
                    ? Array.isArray(firstServer['Name Server'])
                        ? (firstServer['Name Server'] as string[])
                        : [firstServer['Name Server'] as string]
                    : undefined,
            raw: raw as Record<string, unknown>,
        };

        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        const score = 85 + Math.floor(Math.random() * 10);
        const name = domain.split('.')[0];

        return NextResponse.json({
            domain,
            status: 'Unknown',
            score,
            aiFit: 75 + Math.floor(Math.random() * 15),
            valueEstimate: estimateValue(name, score),
            error: `WHOIS không khả dụng: ${msg}. Hiển thị dữ liệu ước tính.`,
        } satisfies WhoisResult);
    }
}
