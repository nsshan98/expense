import { useMutation } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios-client';
import { EditProfileFormValues, ChangePasswordFormValues } from '@/zod/user-schema';

export const useUpdateUserProfile = () => {
    return useMutation({
        mutationFn: async ({ userId, data }: { userId: string; data: EditProfileFormValues }) => {
            const { data: response } = await axiosClient.patch(`/users/${userId}`, {
                name: data.name,
                email: data.email,
                weekendDays: data.weekendDays,
            });
            return response;
        },
    });
};

export const useChangeUserPassword = () => {
    return useMutation({
        mutationFn: async ({ userId, data }: { userId: string; data: Omit<ChangePasswordFormValues, 'confirmPassword'> }) => {
            const { data: response } = await axiosClient.patch(`/users/${userId}/password`, {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            return response;
        },
    });
};
