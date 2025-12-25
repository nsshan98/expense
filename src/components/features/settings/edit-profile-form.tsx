"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, User } from "lucide-react";

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
import { EditProfileSchema, EditProfileFormValues } from "@/zod/user-schema";
import { updateSessionUser } from "@/lib/session";
import { useUpdateUserProfile } from "@/hooks/use-user-profile";

interface EditProfileFormProps {
    initialData: {
        name: string;
        email: string;
    };
    userId: string;
}

export function EditProfileForm({ initialData, userId }: EditProfileFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const updateUserProfile = useUpdateUserProfile();

    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(EditProfileSchema),
        defaultValues: {
            name: initialData.name,
            email: initialData.email,
        },
    });

    async function onSubmit(data: EditProfileFormValues) {
        try {
            await updateUserProfile.mutateAsync({
                userId,
                data
            });

            // Update the session cookie with new details
            await updateSessionUser({
                name: data.name,
                email: data.email
            });

            toast.success("Profile updated successfully");

            // Refresh the page to update server-side data (like sidebar user info)
            startTransition(() => {
                router.refresh();
            });
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            // Handle error message gracefully
            const message = error?.response?.data?.message || "Failed to update profile";
            toast.error(message);
        }
    }

    return (
        <div className="space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Your name"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="email@example.com"
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
                        <Button type="submit" disabled={form.formState.isSubmitting || isPending || updateUserProfile.isPending}>
                            {form.formState.isSubmitting || isPending || updateUserProfile.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
