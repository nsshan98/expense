import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { Category } from '@/types/dashboard';
import { createCategorySchema, updateCategorySchema, CreateCategorySchemaType, UpdateCategorySchemaType } from '@/zod/category-schema';

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axiosClient.get<Category[]>('/categories/all');
            return data;
        },
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newCategory: CreateCategorySchemaType) => {
            const validation = createCategorySchema.safeParse(newCategory);
            if (!validation.success) {
                throw new Error(validation.error.issues[0].message);
            }
            const { data } = await axiosClient.post('/categories/create', newCategory);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: UpdateCategorySchemaType) => {
            const validation = updateCategorySchema.safeParse(payload);
            if (!validation.success) {
                throw new Error(validation.error.issues[0].message);
            }
            const { id, ...data } = payload;
            const { data: response } = await axiosClient.patch(`/categories/${id}`, data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, force }: { id: string; force?: boolean }) => {
            const url = force ? `/categories/${id}?force=true` : `/categories/${id}`;
            const { data } = await axiosClient.delete(url);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};
