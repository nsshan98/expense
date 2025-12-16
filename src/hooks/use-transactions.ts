import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { Transaction, MergeSuggestion } from '@/types/dashboard';
import { transactionSchema, mergeTransactionSchema, updateTransactionSchema, TransactionSchemaType, UpdateTransactionSchemaType } from '@/zod/transaction-schema';

export const useTransactions = () => {
    return useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const { data } = await axiosClient.get<Transaction[]>('/transactions/all');
            return data;
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
        },
    });
};

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
        },
    });
};
