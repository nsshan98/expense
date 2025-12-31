import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { Transaction, MergeSuggestion, PaginatedTransactionsResponse } from '@/types/dashboard';
import { transactionSchema, mergeTransactionSchema, updateTransactionSchema, TransactionSchemaType, UpdateTransactionSchemaType } from '@/zod/transaction-schema';

export const useTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await axiosClient.get<PaginatedTransactionsResponse>('/transactions/all', {
                params: { limit: 10 }
            });
            return data.data.map((t: any) => ({
                ...t,
                type: t.type || (t.category?.type === 'EXPENSE' ? 'expense' : 'income'),
            }));
        },
    });
};

export const useInfiniteTransactions = (filters?: {
    startDate?: string;
    endDate?: string;
    search?: string;
    type?: 'expense' | 'income' | 'all';
}) => {
    return useInfiniteQuery({
        queryKey: ['transactions', 'infinite', filters],
        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await axiosClient.get<PaginatedTransactionsResponse>('/transactions/all', {
                params: {
                    limit: 10,
                    offset: pageParam,
                    ...filters,
                },
            });
            return {
                ...data,
                data: data.data.map((t: any) => ({
                    ...t,
                    type: t.type || (t.category?.type === 'EXPENSE' ? 'expense' : 'income'),
                })),
            };
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.meta.hasNextPage ? lastPage.meta.nextOffset : undefined;
        },
    });
};
export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newTransaction: TransactionSchemaType) => {
            const validation = transactionSchema.safeParse(newTransaction);

            if (!validation.success) {
                const errorMessage = validation.error.issues[0].message;
                throw new Error(errorMessage);
            }

            const { data } = await axiosClient.post('/transactions/create', newTransaction);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['insights'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateTransactionSchemaType) => {
            const validation = updateTransactionSchema.safeParse(payload);

            if (!validation.success) {
                const errorMessage = validation.error.issues[0].message;
                throw new Error(errorMessage);
            }

            const { id, ...data } = payload;
            const { data: response } = await axiosClient.patch(`/transactions/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['insights'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axiosClient.delete(`/transactions/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['insights'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useMergeSuggestions = (name?: string) => {
    return useQuery({
        queryKey: ['merge-suggestions', name],
        queryFn: async () => {
            if (!name) return [];
            const { data } = await axiosClient.get<string[]>('/merge/suggestions', {
                params: { name }
            });
            return data;
        },
        enabled: !!name && name.length > 2, // Only fetch if name has 3+ chars
    });
};

export const useMergeTransactions = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { sourceNames: string[]; targetName: string }) => {
            const validation = mergeTransactionSchema.safeParse(payload);
            if (!validation.success) {
                throw new Error(validation.error.issues[0].message);
            }
            const { data } = await axiosClient.post('/merge', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['merge-suggestions'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};
