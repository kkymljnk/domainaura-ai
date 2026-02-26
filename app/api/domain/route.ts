import { NextRequest, NextResponse } from "next/server";
import { HANOI_CEO_MOCK, type DomainResult } from "@/lib/mockData";

// Generate AI analysis scores for any domain
function generateAiAnalysis(domain: string, status: string) {
    const name = domain.split(".")[0];
    const ext = domain.split(".").slice(1).join(".");

    const premiumTlds = ["ai", "io", "tech", "ceo", "dev", "app"];
    const shortBonus = name.length <= 5 ? 10 : name.length <= 8 ? 5 : 0;
    const tldBonus = premiumTlds.includes(ext) ? 8 : ext === "com" ? 5 : 0;

    const brandScore = Math.min(99, 55 + shortBonus + tldBonus + Math.floor(Math.random() * 20));
    const memorabilityScore = Math.min(99, 50 + shortBonus * 2 + Math.floor(Math.random() * 25));
    const seoScore = Math.min(99, 55 + (ext === "com" ? 15 : 5) + Math.floor(Math.random() * 20));
    const trustScore = Math.min(99, 60 + tldBonus + Math.floor(Math.random() * 20));
    const rarityScore = Math.min(99, status === "available" ? 30 + Math.floor(Math.random() * 40) : 70 + Math.floor(Math.random() * 25));
    const overallScore = Math.round((brandScore + memorabilityScore + seoScore + trustScore + rarityScore) / 5);

    return {
        brandScore,
        memorabilityScore,
        seoScore,
        trustScore,
        rarityScore,
        overallScore,
        summary: status === "available"
            ? `${domain} là một domain ${overallScore >= 75 ? "tiềm năng cao" : "khá tốt"} với TLD .${ext}. ${name.length <= 6 ? "Tên ngắn gọn, dễ nhớ." : "Tên có độ nhận diện trung bình."} Phù hợp cho các dự án digital hiện đại.`
            : `${domain} đang được sở hữu. Domain có giá trị thương hiệu ${overallScore >= 80 ? "cao" : "trung bình"} với điểm tổng thể ${overallScore}/100. Nếu muốn sở hữu, bạn có thể liên hệ chủ sở hữu hoặc chờ domain hết hạn.`,
        strengths: [
            `TLD .${ext} ${premiumTlds.includes(ext) ? "được đánh giá cao trong thị trường digital" : "phổ biến và dễ nhận diện"}`,
            name.length <= 6 ? "Tên ngắn, dễ nhớ, dễ đánh máy" : "Tên mang tính mô tả rõ ràng",
            "Phù hợp làm tên miền thương hiệu cá nhân hoặc doanh nghiệp",
        ],
        weaknesses: [
            status === "registered" ? "Đã có người sở hữu — cần mua lại hoặc tìm phương án thay thế" : "Domain vẫn còn available — hãy đăng ký ngay trước khi có người khác lấy",
            ext !== "com" ? "TLD không phải .com có thể ít nhận diện hơn với users phổ thông" : "",
        ].filter(Boolean),
        useCases: [
            "Thương hiệu cá nhân / Portfolio online",
            "Landing page sản phẩm hoặc dịch vụ",
            "Blog hoặc nền tảng nội dung",
            "Startup hoặc dự án công nghệ",
        ],
        estimatedValue: status === "available"
            ? `$${(10 + shortBonus * 30 + tldBonus * 50).toLocaleString()} – $${(50 + shortBonus * 100 + tldBonus * 200).toLocaleString()} USD`
            : `$${(500 + shortBonus * 200 + tldBonus * 300).toLocaleString()} – $${(2000 + shortBonus * 500 + tldBonus * 800).toLocaleString()} USD`,
        investmentRating: overallScore >= 85 ? "5/5 ⭐ — Đầu tư xuất sắc" : overallScore >= 70 ? "4/5 ⭐ — Đầu tư tốt" : "3/5 ⭐ — Tiềm năng trung bình",
    };
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain")?.toLowerCase().trim();

    if (!domain) {
        return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
        return NextResponse.json({ error: "Invalid domain format. Example: hanoi.ceo" }, { status: 400 });
    }

    // ✅ SPECIAL CASE: hanoi.ceo → return rich mock data
    if (domain === "hanoi.ceo") {
        await new Promise((r) => setTimeout(r, 1800)); // realistic delay
        return NextResponse.json(HANOI_CEO_MOCK);
    }

    // ✅ REAL API: RDAP lookup (public, no API key needed)
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const rdapUrl = `https://rdap.org/domain/${encodeURIComponent(domain)}`;
        const rdapRes = await fetch(rdapUrl, {
            signal: controller.signal,
            headers: { Accept: "application/rdap+json" },
        });

        clearTimeout(timeout);

        const extension = domain.split(".").slice(1).join(".");

        if (rdapRes.status === 404) {
            // Domain not found in RDAP = likely available
            const result: DomainResult = {
                domain,
                status: "available",
                extension: `.${extension}`,
                aiAnalysis: generateAiAnalysis(domain, "available"),
                similarDomains: generateSimilarDomains(domain),
            };
            return NextResponse.json(result);
        }

        if (!rdapRes.ok) {
            throw new Error(`RDAP returned ${rdapRes.status}`);
        }

        const rdap = await rdapRes.json();

        // Parse RDAP response
        const getEvent = (type: string) =>
            rdap.events?.find((e: { eventAction: string; eventDate: string }) => e.eventAction === type)?.eventDate;

        const getEntity = (role: string) =>
            rdap.entities?.find((e: { roles: string[] }) => e.roles?.includes(role));

        const registrarEntity = getEntity("registrar");
        const registrantEntity = getEntity("registrant");

        const registrarName = registrarEntity?.vcardArray?.[1]?.find(
            (v: string[]) => v[0] === "fn"
        )?.[3] ?? registrarEntity?.handle ?? "Unknown";

        const registrantVcard = registrantEntity?.vcardArray?.[1];
        const getVcard = (type: string) =>
            registrantVcard?.find((v: string[]) => v[0] === type)?.[3] ?? undefined;

        const nameservers = rdap.nameservers?.map((ns: { ldhName: string }) => ns.ldhName) ?? [];

        const statusMap: Record<string, string> = {
            active: "registered",
            "client transfer prohibited": "registered",
            "server transfer prohibited": "registered",
        };
        const rdapStatus = rdap.status?.[0]?.toLowerCase() ?? "unknown";
        const mappedStatus = statusMap[rdapStatus] ?? "registered";

        const result: DomainResult = {
            domain,
            status: mappedStatus as "registered",
            registrar: registrarName,
            registrarUrl: registrarEntity?.links?.[0]?.href,
            createdDate: getEvent("registration"),
            updatedDate: getEvent("last changed") || getEvent("last update of RDAP database"),
            expiresDate: getEvent("expiration"),
            nameservers,
            registrant: {
                name: getVcard("fn"),
                organization: getVcard("org"),
                country: getVcard("adr")?.[6] ?? undefined,
            },
            dnssec: rdap.secureDNS?.delegationSigned ? "signed" : "unsigned",
            whoisServer: rdap.port43 ?? undefined,
            extension: `.${extension}`,
            tldInfo: {
                type: getTldType(extension),
                purpose: getTldPurpose(extension),
                marketValue: getTldMarketValue(extension),
            },
            aiAnalysis: generateAiAnalysis(domain, "registered"),
            similarDomains: generateSimilarDomains(domain),
            rawRdap: rdap,
        };

        return NextResponse.json(result);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";

        // Fallback: if RDAP fails assume unknown
        const extension = domain.split(".").slice(1).join(".");
        const result: DomainResult = {
            domain,
            status: "unknown",
            extension: `.${extension}`,
            error: `Không thể kiểm tra domain (${msg}). Kết quả có thể không chính xác.`,
            aiAnalysis: generateAiAnalysis(domain, "unknown"),
            similarDomains: generateSimilarDomains(domain),
        };
        return NextResponse.json(result, { status: 200 }); // still 200, show partial data
    }
}

function getTldType(ext: string): string {
    const types: Record<string, string> = {
        com: "Commercial gTLD",
        net: "Network gTLD",
        org: "Organization gTLD",
        io: "Country-code TLD (British Indian Ocean) / Tech favorite",
        ai: "Country-code TLD (Anguilla) / AI Industry favorite",
        ceo: "Generic TLD (gTLD) — Executive identity",
        tech: "Generic TLD (gTLD)",
        dev: "Generic TLD (gTLD) — Developer focused",
        app: "Generic TLD (gTLD) — Application focused",
        vn: "Country-code TLD (Vietnam)",
        co: "Country-code TLD (Colombia) / Startup favorite",
    };
    return types[ext] ?? `Generic TLD (.${ext})`;
}

function getTldPurpose(ext: string): string {
    const purposes: Record<string, string> = {
        com: "Thương mại toàn cầu — TLD phổ biến nhất, được tin dùng nhất",
        net: "Mạng lưới, dịch vụ internet, cơ sở hạ tầng",
        org: "Tổ chức phi lợi nhuận, cộng đồng, NGO",
        io: "Startup công nghệ, SaaS, developer tools",
        ai: "Artificial Intelligence, ML, dự án AI",
        ceo: "Dành riêng cho CEO, lãnh đạo cấp cao, thương hiệu cá nhân executive",
        tech: "Công ty công nghệ, startup tech",
        dev: "Developer, engineer, open-source projects",
        app: "Mobile app, web application",
        vn: "Doanh nghiệp Việt Nam, nhắm thị trường trong nước",
        co: "Startup, company — thay thế .com ngắn gọn",
    };
    return purposes[ext] ?? `TLD dành cho các mục đích chung`;
}

function getTldMarketValue(ext: string): string {
    const premium = ["ai", "io", "ceo", "dev", "app"];
    const mid = ["tech", "co", "com", "net"];
    if (premium.includes(ext)) return "Premium — Thị trường cao cấp";
    if (mid.includes(ext)) return "Standard — Phổ biến rộng rãi";
    return "Economy — Giá cả phải chăng";
}

function generateSimilarDomains(domain: string) {
    const name = domain.split(".")[0];
    const ext = domain.split(".").slice(1).join(".");
    const alternatives = ["com", "io", "ai", "tech", "co"].filter((e) => e !== ext);

    return alternatives.slice(0, 4).map((altExt) => ({
        domain: `${name}.${altExt}`,
        status: Math.random() > 0.4 ? ("available" as const) : ("registered" as const),
        price: Math.random() > 0.4 ? `$${(10 + Math.floor(Math.random() * 190))}/yr` : null,
    }));
}
