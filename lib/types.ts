export interface ServiceLink {
    name: string;
    status: 'linked' | 'unlinked';
}

export interface UnlinkedService {
    name: string;
    note: string;
}

export interface WhoisResult {
    domain: string;
    status: string;
    score: number;
    aiFit: number;
    valueEstimate: string;
    special?: boolean;
    message?: string;
    linkedServices?: ServiceLink[];
    unlinkedServices?: UnlinkedService[];
    registrar?: string;
    createdDate?: string;
    expiresDate?: string;
    nameservers?: string[];
    raw?: Record<string, unknown>;
    error?: string;
}

export interface BrandItem {
    name: string;
    slug: string;
    color: string;
    note?: string;
}
