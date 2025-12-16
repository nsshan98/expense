import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { Budget } from '@/types/dashboard';
import { createBudgetSchema, updateBudgetSchema } from '@/zod/budget-schema';

export const useBudgets = () => {
    return useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            const { data } = await axiosClient.get<Budget[]>('/budgets');
            return data;
        },
    });
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { category: string; amount: number }) => {
            const validation = createBudgetSchema.safeParse(payload);
            if (!validation.success) {
                throw new Error(validation.error.issues[0].message);
            }
            const { data } = await axiosClient.post('/budgets', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        },
    });
};

export const useUpdateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: string; amount: number }) => {
            const validation = updateBudgetSchema.safeParse(payload);
            if (!validation.success) {
                throw new Error(validation.error.issues[0].message);
            }
            const { data } = await axiosClient.patch(`/budgets/${payload.id}`, { amount: payload.amount });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
        },
    });
};
