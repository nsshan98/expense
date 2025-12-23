"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Lock, KeyRound } from "lucide-react";

import { Button } from "@/components/atoms/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { ChangePasswordSchema, ChangePasswordFormValues } from "@/zod/user-schema";
import { axiosClient } from "@/lib/axios-client";

interface ChangePasswordFormProps {
    userId: string;
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(data: ChangePasswordFormValues) {
        try {
            await axiosClient.patch(`/users/${userId}`, {
                oldPassword: data.oldPassword,
                password: data.newPassword,
            });

            toast.success("Password updated successfully");
            form.reset();
        } catch (error: any) {
            console.error("Failed to update password:", error);
            toast.error(error.response?.data?.message || "Failed to update password");
        }
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <KeyRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="Enter current password"
                                                className="pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="Enter new password"
                                                className="pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="Confirm new password"
                                                className="pl-9"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.formState.isSubmitting || isPending}>
                            {form.formState.isSubmitting || isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
