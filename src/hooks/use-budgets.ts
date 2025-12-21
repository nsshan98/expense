import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { Budget } from '@/types/dashboard';
import { createBudgetSchema, updateBudgetSchema } from '@/zod/budget-schema';

export const useBudgets = (month?: string) => {
    return useQuery({
        queryKey: ['budgets', month],
        queryFn: async () => {
            // Ensure month is passed as query param exactly as requested ?month=MM-YYYY
            const params = month ? { month } : {};
            const { data } = await axiosClient.get<Budget[]>('/budgets/all', { params });
            return data;
        },
    });
};

export const useBudget = (id: string) => {
    return useQuery({
        queryKey: ['budgets', id],
        queryFn: async () => {
            const { data } = await axiosClient.get<Budget>(`/budgets/${id}`);
            return data;
        },
        enabled: !!id
    });
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { categoryId: string; amount: number; month?: string } | { categoryName: string; categoryType: "EXPENSE" | "INCOME"; amount: number; month?: string }) => {
            // Note: Zod schema union validation is a bit complex to handle generically here if we strictly want to validate before sending.
            // But trusting the payload structure matches one of the options.
            const validation = createBudgetSchema.safeParse(payload);
            if (!validation.success) {
                // Try to get a meaningful error message
                throw new Error("Invalid budget data");
            }
            const { data } = await axiosClient.post('/budgets/create', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useUpdateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; amount?: number }) => {
            const validation = updateBudgetSchema.safeParse(payload);
            if (!validation.success) {
                throw new Error(validation.error.issues[0].message);
            }
            const { data } = await axiosClient.patch(`/budgets/${payload.id}`, {
                amount: payload.amount
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        },
    });
};

export const useDeleteBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axiosClient.delete(`/budgets/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        },
    });
};
