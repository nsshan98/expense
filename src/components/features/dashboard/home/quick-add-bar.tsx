"use client";

import { Button } from "@/components/atoms/button";
import { useCreateTransaction, useMergeSuggestions, useMergeTransactions } from "@/hooks/use-transactions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quickAddSchema, QuickAddFormValues } from "@/zod/transaction-schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/atoms/form";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/atoms/input-group";
import { Tag, Loader2, Plus, Info, Settings } from "lucide-react";
import { FaClipboardList, FaBangladeshiTakaSign } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { MergeSuggestionBanner } from "@/components/features/transactions/merge-suggestion-banner";
import { MergeConfirmationModal } from "@/components/features/transactions/merge-confirmation-modal";

import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";

interface QuickAddBarProps {
    hasApiKey?: boolean;
}

export function QuickAddBar({ hasApiKey }: QuickAddBarProps) {
    const createTransaction = useCreateTransaction();

    // Merge Module Hooks
    const [debouncedName, setDebouncedName] = useState("");
    const { data: rawSuggestions } = useMergeSuggestions(debouncedName);
    const mergeTransactions = useMergeTransactions();
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);

    // Map suggestions to string array for UI
    const suggestions = rawSuggestions || [];

    const form = useForm<QuickAddFormValues>({
        resolver: zodResolver(quickAddSchema),
        defaultValues: {
            name: "",
            amount: "",
            date: new Date().toISOString(),
        },
    });

    const nameValue = form.watch("name");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(nameValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [nameValue]);

    const { isSubmitting } = form.formState;

    const onSubmit = async (data: QuickAddFormValues) => {
        try {
            await createTransaction.mutateAsync({
                name: data.name,
                amount: parseFloat(data.amount),
                date: new Date().toISOString(),
                note: data.note,
                // Type is optional in the create payload, often defaults to expense on backend or we can pass it if needed.
            });
            toast.success("Expense added successfully");
            form.reset({
                name: "",
                amount: "",
                date: new Date().toISOString(),
                note: "",
            });
            setDebouncedName(""); // Reset suggestions
        } catch (error) {
            console.error(error);
            toast.error("Failed to add expense");
        }
    };

    const handleMerge = async (sourceNames: string[], targetName: string) => {
        try {
            await mergeTransactions.mutateAsync({
                sourceNames,
                targetName: targetName.toLowerCase() // API requirement
            });
            toast.success("Merged successfully");
            setIsMergeModalOpen(false);
            form.setValue("name", targetName); // Keep capitalized for UI
        } catch (error: any) {
            toast.error(error.message || "Failed to merge");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {hasApiKey === false && (
                <Alert className="bg-blue-50/50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300 font-medium flex items-center gap-2">
                        Smart Features configuration missing
                    </AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400 mt-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <span className="text-sm">
                            Configure your API key to enable auto-categorization and AI insights. Without it, transactions may need manual updates.
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-blue-200 hover:bg-blue-100 hover:text-blue-900 dark:border-blue-800 dark:hover:bg-blue-900/50 dark:hover:text-blue-100 whitespace-nowrap"
                            href="/settings"
                        >
                            <Settings className="h-3.5 w-3.5 mr-2" />
                            Configure API
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <div className="p-4 bg-card rounded-xl border shadow-sm">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col md:flex-row gap-4 items-start md:items-start"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1 w-full">
                                    <FormControl>
                                        <div className="flex flex-col">
                                            <InputGroup>
                                                <InputGroupInput
                                                    placeholder="Expense name (e.g., Coffee)"
                                                    {...field}
                                                />
                                                <InputGroupAddon>
                                                    <FaClipboardList className="h-4 w-4" />
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <MergeSuggestionBanner
                                                suggestions={suggestions}
                                                onMergeClick={() => setIsMergeModalOpen(true)}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem className="flex-1 w-full">
                                    <FormControl>
                                        <InputGroup>
                                            <InputGroupInput
                                                placeholder="Note (optional)"
                                                {...field}
                                            />
                                            <InputGroupAddon>
                                                <Tag className="h-4 w-4" />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem className="w-full md:w-[200px]">
                                    <FormControl>
                                        <InputGroup>
                                            <InputGroupInput
                                                type="number"
                                                placeholder="Amount"
                                                {...field}
                                            />
                                            <InputGroupAddon>
                                                <FaBangladeshiTakaSign className="h-4 w-4" />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting || createTransaction.isPending}
                            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                        >
                            {isSubmitting || createTransaction.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Expense
                                </>
                            )}
                        </Button>
                    </form>
                </Form>

                <MergeConfirmationModal
                    isOpen={isMergeModalOpen}
                    onClose={() => setIsMergeModalOpen(false)}
                    suggestions={suggestions}
                    onMerge={handleMerge}
                    isMerging={mergeTransactions.isPending}
                />
            </div>
        </div>
    );
}
