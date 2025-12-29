import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { AnalyticsData, DashboardSummary, DashboardResponse } from '@/types/dashboard';
import { useTransactions } from './use-transactions';
import { useBudgets } from './use-budgets';

export const useAnalytics = () => {
    return useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const { data } = await axiosClient.get<AnalyticsData>('/insights');
            return data;
        },
    });
};

export const useDashboard = () => {
    return useQuery({
        queryKey: ['dashboard-data'],
        queryFn: async () => {
            const { data } = await axiosClient.get<DashboardResponse>('/insights/dashboard');
            return data;
        },
    });
};


export const useDashboardSummary = () => {
    const { data: dashboardData, isLoading } = useDashboard();

    const summary: DashboardSummary = {
        todaySpend: dashboardData?.fast_stats.todays_spend || 0,
        thisMonthSpend: dashboardData?.fast_stats.this_month_spend || 0,
        thisMonthTrend: dashboardData?.fast_stats.trend_percentage || 0,
        remainingBudget: dashboardData?.fast_stats.total_remaining_budget || 0,
        remainingPercentage: dashboardData?.fast_stats.remaining_percentage || 0
    };

    return { data: summary, isLoading };
};

export const useAnalyticsTrends = () => {
    return useQuery({
        queryKey: ['analytics-trends'],
        queryFn: async () => {
            const { data } = await axiosClient.get<import('@/types/analytics').AnalyticsTrendsResponse>('/analytics/trends');
            return data;
        },
    });
};

export const useBreakdownAnalytics = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['breakdown-analytics', startDate, endDate],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const { data } = await axiosClient.get<import('@/types/breakdown').BreakdownAnalyticsResponse>(
                `/analytics/breakdown?${params.toString()}`
            );
            return data;
        },
        // Only fetch when both dates are provided AND they are different
        enabled: !!startDate && !!endDate && startDate !== endDate,
    });
};
