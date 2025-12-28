"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios-client";
import {
    ExpenseSummary,
    SpendingTrend,
    BudgetCategory,
    Insight,
    Transaction,
    CreateExpensePayload
} from "@/types/dashboard";

import { useDashboard } from "./use-analytics";

export const useDashboardSummary = () => {
    const { data: dashboardData, isLoading } = useDashboard();

    return {
        dashboardSummaryQuery: {
            data: {
                todaySpend: dashboardData?.fast_stats.todays_spend || 0,
                todayTrend: 0,
                thisMonthSpend: dashboardData?.fast_stats.this_month_spend || 0,
                thisMonthTrend: dashboardData?.fast_stats.trend_percentage || 0,
                remainingBudget: dashboardData?.fast_stats.total_remaining_budget || 0,
                remainingPercentage: dashboardData?.fast_stats.remaining_percentage || 0
            },
            isLoading
        }
    };
};

export const useSpendingTrend = () => {
    const { data: dashboardData, isLoading } = useDashboard();
    return { spendingTrendQuery: { data: dashboardData?.trend_analysis.chart_data || [], isLoading } };
};

export const useCategoryBudgets = () => {
    const { data: dashboardData, isLoading } = useDashboard();

    // Map to include derived fields used by UI
    const budgets = dashboardData?.budget_status?.map((b: any) => {
        const amount = b.amount || 0;
        const spent = b.spent_this_month || 0;
        const percentage = amount > 0 ? (spent / amount) * 100 : 0;
        const remaining = Math.max(0, amount - spent);
        const over = Math.max(0, spent - amount);

        return {
            id: b.id,
            category: {
                id: b.category?.id || 'unknown',
                name: typeof b.category === 'string' ? b.category : b.category?.name || 'Unknown',
                type: 'EXPENSE'
            },
            amount: amount,
            spent_this_month: spent,
            remaining: remaining,
            over: over,
            percentage: percentage
        };
    }) || [];

    return { categoryBudgetsQuery: { data: budgets, isLoading } };
};

export const useInsights = () => {
    const { data: dashboardData, isLoading } = useDashboard();

    // Convert single smart_insight to array for compatibility with component
    const insights = dashboardData?.smart_insight ? [dashboardData.smart_insight] : [];

    return { insightsQuery: { data: insights, isLoading } };
};

export const useRecentTransactions = () => {
    const recentTransactionsQuery = useQuery({
        queryKey: ["recent-transactions"],
        queryFn: async () => {
            const { data } = await axiosClient.get<Transaction[]>("/expenses/recent");
            return data;
        },
    });
    return { recentTransactionsQuery };
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();

    const createExpenseMutation = useMutation({
        mutationFn: async (payload: CreateExpensePayload) => {
            const { data } = await axiosClient.post<Transaction>("/expenses", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recent-transactions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
            queryClient.invalidateQueries({ queryKey: ["category-budgets"] });
            queryClient.invalidateQueries({ queryKey: ["spending-trend"] });
        },
    });

    return { createExpenseMutation };
};
