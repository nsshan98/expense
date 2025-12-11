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

export const useDashboardSummary = () => {
    const dashboardSummaryQuery = useQuery({
        queryKey: ["dashboard-summary"],
        queryFn: async () => {
            const { data } = await axiosClient.get<ExpenseSummary>("/expenses/summary");
            return data;
        },
    });
    return { dashboardSummaryQuery };
};

export const useSpendingTrend = () => {
    const spendingTrendQuery = useQuery({
        queryKey: ["spending-trend"],
        queryFn: async () => {
            const { data } = await axiosClient.get<SpendingTrend[]>("/expenses/trend");
            return data;
        },
    });
    return { spendingTrendQuery };
};

export const useCategoryBudgets = () => {
    const categoryBudgetsQuery = useQuery({
        queryKey: ["category-budgets"],
        queryFn: async () => {
            const { data } = await axiosClient.get<BudgetCategory[]>("/budgets");
            return data;
        },
    });
    return { categoryBudgetsQuery };
};

export const useInsights = () => {
    const insightsQuery = useQuery({
        queryKey: ["insights"],
        queryFn: async () => {
            const { data } = await axiosClient.get<Insight[]>("/expenses/insights");
            return data;
        },
    });
    return { insightsQuery };
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
