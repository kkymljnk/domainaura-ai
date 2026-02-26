// Mock data for hanoi.ceo - rich demo data
export const HANOI_CEO_MOCK = {
    domain: "hanoi.ceo",
    status: "registered",
    registrar: "Porkbun LLC",
    registrarUrl: "https://porkbun.com",
    createdDate: "2022-09-14T00:00:00Z",
    updatedDate: "2024-09-01T00:00:00Z",
    expiresDate: "2050-02-26T00:00:00Z",
    nameservers: ["ns1.porkbun.com", "ns2.porkbun.com"],
    registrant: {
        name: "REDACTED FOR PRIVACY",
        organization: "Hanoi Digital Ventures Ltd.",
        country: "VN",
        city: "Hanoi",
    },
    dnssec: "unsigned",
    whoisServer: "whois.nic.ceo",
    extension: ".ceo",
    tldInfo: {
        type: "Generic TLD (gTLD)",
        operator: "Afilias Limited",
        purpose: "Corporate executive identity — reserved for high-profile CEOs and business leaders",
        marketValue: "Premium",
    },
    aiAnalysis: {
        brandScore: 97,
        memorabilityScore: 94,
        seoScore: 88,
        trustScore: 96,
        rarityScore: 95,
        overallScore: 95,
        summary:
            "hanoi.ceo là một domain cực kỳ cao cấp và hiếm có. Kết hợp giữa thành phố thủ đô năng động nhất Việt Nam với TLD .ceo dành riêng cho lãnh đạo doanh nghiệp. Domain này có giá trị thương hiệu xuất sắc, phù hợp cho AI & Computer CEO, founder công nghệ, hoặc bất kỳ lãnh đạo doanh nghiệp nào muốn khẳng định vị thế đẳng cấp.",
        strengths: [
            "TLD .ceo cực kỳ hiếm và uy tín — ít hơn 50,000 domain đăng ký toàn cầu",
            "Hanoi — thủ đô công nghệ đang bùng nổ, top 10 thành phố khởi nghiệp châu Á",
            "Ngắn gọn, dễ nhớ, dễ đánh máy — chỉ 9 ký tự",
            "Không cần giải thích — tên tự nói lên tất cả",
            "SEO friendly — địa danh + chức vụ tạo authority tự nhiên",
        ],
        weaknesses: [
            "Đã được đăng ký — cần thương lượng mua lại",
            "TLD .ceo ít phổ biến hơn .com với audience phổ thông",
        ],
        useCases: [
            "Portfolio cá nhân CEO / Founder công nghệ",
            "Agency tư vấn chiến lược doanh nghiệp",
            "Nền tảng kết nối C-Suite executives Việt Nam",
            "Hội nghị doanh nhân & leadership summit",
            "Thương hiệu cá nhân cao cấp",
        ],
        estimatedValue: "$8,500 – $25,000 USD",
        investmentRating: "5/5 ⭐ — Tài sản số cực kỳ tiềm năng",
    },
    dns: {
        a: ["104.21.45.213", "172.67.198.91"],
        ns: ["ns1.porkbun.com", "ns2.porkbun.com", "ns3.porkbun.com", "ns4.porkbun.com"],
        mx: [{ priority: 10, exchange: "mail.hanoi.ceo" }],
        txt: ["v=spf1 include:_spf.google.com ~all"],
    },
    similarDomains: [
        { domain: "saigon.ceo", status: "available", price: "$35/yr" },
        { domain: "vietnam.ceo", status: "registered", price: null },
        { domain: "hanoi.ai", status: "available", price: "$199/yr" },
        { domain: "hanoiceo.com", status: "available", price: "$12/yr" },
        { domain: "hanoi.tech", status: "available", price: "$45/yr" },
    ],
};

// Type definitions
export interface DomainResult {
    domain: string;
    status: "registered" | "available" | "error" | "unknown";
    registrar?: string;
    registrarUrl?: string;
    createdDate?: string;
    updatedDate?: string;
    expiresDate?: string;
    nameservers?: string[];
    registrant?: {
        name?: string;
        organization?: string;
        country?: string;
        city?: string;
    };
    dnssec?: string;
    whoisServer?: string;
    extension?: string;
    tldInfo?: {
        type?: string;
        operator?: string;
        purpose?: string;
        marketValue?: string;
    };
    aiAnalysis?: {
        brandScore: number;
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
    dns?: {
        a?: string[];
        ns?: string[];
        mx?: { priority: number; exchange: string }[];
        txt?: string[];
    };
    similarDomains?: {
        domain: string;
        status: "available" | "registered" | "unknown";
        price: string | null;
    }[];
    rawRdap?: Record<string, unknown>;
    error?: string;
}
