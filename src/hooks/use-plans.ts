import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { Plan } from '@/types/subscription';

export const usePlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            const { data } = await axiosClient.get<Plan[]>('/plans/all-plans');
            return data;
        },
    });
};

export const usePlan = (id: string) => {
    return useQuery({
        queryKey: ['plans', id],
        queryFn: async () => {
            const { data } = await axiosClient.get<Plan>(`/plans/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
