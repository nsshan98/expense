import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { AnalyticsData, DashboardSummary } from '@/types/dashboard';
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

export const useDashboardSummary = () => {
    const { data: transactions } = useTransactions();
    const { data: budgets } = useBudgets();

    // This logic should ideally be on the backend, but implementing here for now
    const calculateSummary = (): DashboardSummary => {
        if (!transactions || !budgets) return {
            todaySpend: 0,
            thisMonthSpend: 0,
            thisMonthTrend: 0,
            remainingBudget: 0,
            remainingPercentage: 0
        };

        const today = new Date().toISOString().split('T')[0];
        const todaySpend = transactions
            .filter(t => t.date.startsWith(today) && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const thisMonthSpend = transactions
            .filter(t => t.date.startsWith(thisMonth) && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
        const remainingBudget = totalBudget - thisMonthSpend;
        const remainingPercentage = totalBudget > 0 ? (remainingBudget / totalBudget) * 100 : 0;

        return {
            todaySpend,
            thisMonthSpend,
            thisMonthTrend: 5, // Mock trend
            remainingBudget,
            remainingPercentage,
        };
    };

    return { data: calculateSummary(), isLoading: !transactions || !budgets };
};
