import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { Category } from '@/types/dashboard';
import { createCategorySchema } from '@/zod/category-schema';

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
            const validation = createCategorySchema.safeParse(newCategory);
            if (!validation.success) {
                throw new Error(validation.error.issues[0].message);
            }
            const { data } = await axiosClient.post('/categories', newCategory);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};
