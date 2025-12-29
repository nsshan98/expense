export interface MerchantBreakdown {
    name: string;
    amount: number;
    count: number;
}

export interface CategoryBreakdown {
    id: string;
    name: string;
    total: number;
    count: number;
    merchants: MerchantBreakdown[];
    percentage: number;
}

export interface BreakdownAnalyticsResponse {
    period: {
        start: string; // "27-11-2025"
        end: string;   // "27-12-2025"
    };
    total_spend: number;
    breakdown: CategoryBreakdown[];
}
