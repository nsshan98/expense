import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { SubscriptionStatus, TransactionHistoryResponse } from '@/types/subscription';

export const useSubscriptionStatus = () => {
    return useQuery({
        queryKey: ['subscription-status'],
        queryFn: async () => {
            const { data } = await axiosClient.get<SubscriptionStatus>('/billing-local/status');
            return data;
        },
    });
};

import { keepPreviousData } from '@tanstack/react-query';

export const useSubscriptionHistory = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['subscription-history', page, limit],
        queryFn: async () => {
            const { data } = await axiosClient.get<TransactionHistoryResponse>(`/billing-local/history`, {
                params: { page, limit }
            });
            return data;
        },
        placeholderData: keepPreviousData,
    });
};
