"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Mail, User, DollarSign } from "lucide-react";

import { Button } from "@/components/atoms/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { Checkbox } from "@/components/atoms/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/atoms/select";
import { EditProfileSchema, EditProfileFormValues } from "@/zod/user-schema";
import { updateSessionUser } from "@/lib/session";
import { useUpdateUserProfile } from "@/hooks/use-user-profile";
import { CURRENCY_OPTIONS } from "@/lib/currencies";

interface EditProfileFormProps {
    initialData: {
        name: string;
        email: string;
        weekendDays?: number[];
        currency?: string;
    };
    userId: string;
}

const DAYS_OF_WEEK = [
    { id: 0, label: "Sunday" },
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 6, label: "Saturday" },
];

export function EditProfileForm({ initialData, userId }: EditProfileFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const updateUserProfile = useUpdateUserProfile();

    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(EditProfileSchema),
        defaultValues: {
            name: initialData.name,
            email: initialData.email,
            weekendDays: initialData.weekendDays || [],
            currency: initialData.currency || "BDT",
        },
    });

    async function onSubmit(data: EditProfileFormValues) {
        // Simple dirty check (deep comparison would be better but this is fine for now)
        const isNameChanged = data.name !== initialData.name;
        const isEmailChanged = data.email !== initialData.email;
        const isCurrencyChanged = data.currency !== initialData.currency;

        // Sort arrays to compare
        const currentWeekendDays = [...(data.weekendDays || [])].sort().join(',');
        const initialWeekendDays = [...(initialData.weekendDays || [])].sort().join(',');
        const isWeekendChanged = currentWeekendDays !== initialWeekendDays;

        if (!isNameChanged && !isEmailChanged && !isWeekendChanged && !isCurrencyChanged) {
            toast.info("No changes detected");
            return;
        }

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preferred Currency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Select currency" />
                                                </div>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[300px]">
                                            {CURRENCY_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="weekendDays"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Weekend Preferences</FormLabel>
                                    <FormDescription>
                                        Select the days you consider as your weekend.
                                    </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {DAYS_OF_WEEK.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="weekendDays"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...(field.value || []), item.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {item.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
