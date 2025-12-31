export interface PeriodAnalysis {
    current_total: number;
    previous_total: number;
    percentage_change: number;
    period_current: string;
    period_previous: string;
}

export interface MomAnalysis {
    calendar_month: PeriodAnalysis;
    rolling_30_days: PeriodAnalysis;
}

export interface WeekdayWeekendAnalysis {
    weekday_avg: number;
    weekend_avg: number;
    weekend_days: number[];
    weekday_days: number[];
    is_weekend_higher: boolean;
    formatted_message: string;
}

export interface MonthlySpending {
    month: string;
    fullMonth: string;
    amount: number;
    is_peak: boolean;
    trend_percentage: number;
}

export interface AnalyticsTrendsSuccessResponse {
    status: 'success';
    available_years?: number[];
    mom_analysis: MomAnalysis;
    weekend_vs_weekday?: WeekdayWeekendAnalysis;
    seasonality?: MonthlySpending[];
}

export interface AnalyticsTrendsMissingConfigResponse {
    status: 'missing_configuration';
    message: string;
    setup_required: string[];
}

export type AnalyticsTrendsResponse = AnalyticsTrendsSuccessResponse | AnalyticsTrendsMissingConfigResponse;
