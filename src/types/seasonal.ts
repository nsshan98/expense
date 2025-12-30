export interface MonthlySpending {
    month: string; // "Jan", "Feb", etc.
    fullMonth: string; // "2025-01"
    amount: number;
    is_peak: boolean;
    trend_percentage: number;
}

export interface SeasonalBreakdownResponse {
    data: MonthlySpending[];
    peak_month?: {
        month: string;
        amount: number;
    };
    available_years: number[];
}
