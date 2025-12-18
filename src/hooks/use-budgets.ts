import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { Budget } from '@/types/dashboard';
import { createBudgetSchema, updateBudgetSchema } from '@/zod/budget-schema';

export const useBudgets = (month?: string) => {
    return useQuery({
        queryKey: ['budgets', month],
        queryFn: async () => {
            const params = month ? { month } : {};
            const { data } = await axiosClient.get<Budget[]>('/budgets/all', { params });
            return data;
        },
    });
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { categoryId: string; amount: number; month?: string } | { categoryName: string; categoryType: "EXPENSE" | "INCOME"; amount: number; month?: string }) => {
            const validation = createBudgetSchema.safeParse(payload);
            if (!validation.success) {
                // If validation fails, we can try to extract a meaningful error
                // Union validation errors can be verbose, so extracting the first issue might be tricky depending on which union path failed.
                // We'll trust the first issue of the first error for now, or just the global error.
                throw new Error(validation.error.issues[0].message);
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
        mutationFn: async (payload: { id: string; amount?: number; month?: string }) => {
            const validation = updateBudgetSchema.safeParse(payload);
            if (!validation.success) {
                throw new Error(validation.error.issues[0].message);
            }
            const { data } = await axiosClient.patch(`/budgets/${payload.id}`, {
                amount: payload.amount,
                month: payload.month
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
