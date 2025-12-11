import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { Transaction, Budget, Category, MergeSuggestion, AnalyticsData, DashboardSummary } from '@/types/dashboard';

// --- Transactions ---
export const useTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await axiosClient.get<Transaction[]>('/transactions');
            return data;
        },
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTransaction: Omit<Transaction, 'id'>) => {
            const { data } = await axiosClient.post('/transactions', newTransaction);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['insights'] });
        },
    });
};

// --- Budgets ---
export const useBudgets = () => {
    return useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            const { data } = await axiosClient.get<Budget[]>('/budgets');
            return data;
        },
    });
};

// --- Categories ---
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axiosClient.get<Category[]>('/categories');
            return data;
        },
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCategory: { name: string }) => {
            const { data } = await axiosClient.post('/categories', newCategory);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useUpdateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; amount: number }) => {
            const { data } = await axiosClient.patch(`/budgets/${payload.id}`, { amount: payload.amount });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        },
    });
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { category: string; amount: number }) => {
            const { data } = await axiosClient.post('/budgets', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        },
    });
};

// --- Merge ---
export const useMergeSuggestions = () => {
    return useQuery({
        queryKey: ['merge-suggestions'],
        queryFn: async () => {
            const { data } = await axiosClient.get<MergeSuggestion[]>('/merge/suggestions');
            return data;
        },
    });
};

export const useMergeTransactions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { originalName: string; finalName: string }) => {
            const { data } = await axiosClient.post('/merge', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['merge-suggestions'] });
        },
    });
};

// --- Insights & Summary ---
// Assuming /insights returns aggregated data for charts and summary
export const useAnalytics = () => {
    return useQuery({
        queryKey: ['analytics'],
        queryFn: async () => {
            const { data } = await axiosClient.get<AnalyticsData>('/insights');
            return data;
        },
    });
};

// Mocking summary for now if no endpoint exists, or deriving from transactions
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
