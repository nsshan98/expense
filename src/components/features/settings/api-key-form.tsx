"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Key, Check, X, Trash2 } from "lucide-react";
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
import { ApiKeySchema, ApiKeyFormValues } from "@/zod/api-key-schema";
import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios-client";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/atoms/alert-dialog";

interface ApiKeyFormProps {
    userId: string;
    hasKey: boolean;
    maskedKey?: string;
}

export function ApiKeyForm({ userId, hasKey = false, maskedKey }: ApiKeyFormProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const form = useForm<ApiKeyFormValues>({
        resolver: zodResolver(ApiKeySchema),
        defaultValues: {
            geminiApiKey: "",
        },
    });

    const updateApiKeyMutation = useMutation({
        mutationFn: async (data: ApiKeyFormValues) => {
            const { data: response } = await axiosClient.patch(`/users/${userId}`, data);
            return response;
        },
        onSuccess: () => {
            toast.success("API Key updated successfully");
            setIsEditing(false);
            form.reset();
            router.refresh();
        },
        onError: (error: any) => {
            console.error("Failed to update API key:", error);
            const message = error?.response?.data?.message || "Failed to update API key";
            toast.error(message);
        },
    });

    const removeApiKeyMutation = useMutation({
        mutationFn: async () => {
            const { data: response } = await axiosClient.patch(`/users/${userId}`, {
                geminiApiKey: null
            });
            return response;
        },
        onSuccess: () => {
            toast.success("API Key removed successfully");
            setIsDeleting(false);
            router.refresh();
        },
        onError: (error: any) => {
            console.error("Failed to remove API key:", error);
            const message = error?.response?.data?.message || "Failed to remove API key";
            toast.error(message);
        },
    });

    async function onSubmit(data: ApiKeyFormValues) {
        await updateApiKeyMutation.mutateAsync(data);
    }

    async function onRemove() {
        await removeApiKeyMutation.mutateAsync();
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-medium">Gemini API Key</p>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                            {hasKey ? (
                                <>
                                    <span className="text-green-600 flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Configured
                                    </span>
                                    <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                                        {maskedKey || "********"}
                                    </span>
                                </>
                            ) : (
                                <span className="text-amber-600 flex items-center gap-1">
                                    <X className="h-3 w-3" /> Not Configured
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {hasKey && (
                        <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="h-9 flex-1 md:flex-none">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remove
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently remove your Gemini API key from our system.
                                        You will need to provide a new key to use AI features.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={removeApiKeyMutation.isPending}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onRemove();
                                        }}
                                        disabled={removeApiKeyMutation.isPending}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {removeApiKeyMutation.isPending ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Removing...
                                            </>
                                        ) : (
                                            "Remove Key"
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <Button
                        variant={isEditing ? "ghost" : "outline"}
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex-1 md:flex-none"
                    >
                        {isEditing ? "Cancel" : (hasKey ? "Update Key" : "Add Key")}
                    </Button>
                </div>
            </div>

            {isEditing && (
                <div className="p-4 border rounded-lg bg-muted/30 animate-in fade-in slide-in-from-top-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="geminiApiKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter API Key</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    placeholder="Enter your Gemini API Key"
                                                    className="pl-9"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription>
                                            Your API key will be encrypted and stored safely.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting || updateApiKeyMutation.isPending}
                                >
                                    {form.formState.isSubmitting || updateApiKeyMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save API Key"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}
        </div>
    );
}
