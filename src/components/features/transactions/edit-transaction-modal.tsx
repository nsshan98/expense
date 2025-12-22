"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useUpdateTransaction, useMergeSuggestions, useMergeTransactions } from "@/hooks/use-transactions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Transaction, MergeSuggestion } from "@/types/dashboard";
import { MergeSuggestionBanner } from "./merge-suggestion-banner";
import { MergeConfirmationModal } from "./merge-confirmation-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { editTransactionSchema, EditTransactionFormValues } from "@/zod/transaction-schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/atoms/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { useCategories } from "@/hooks/use-categories";

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
    const updateTransaction = useUpdateTransaction();
    const { data: categories } = useCategories();

    // Merge Module Hooks
    const [debouncedName, setDebouncedName] = useState("");
    const { data: rawSuggestions } = useMergeSuggestions(debouncedName);
    const mergeTransactions = useMergeTransactions();
    const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);

    // Map suggestions to string array for UI
    // specific logic: assuming API returns objects with originalName as the specific entity found
    const suggestions = rawSuggestions || [];

    const form = useForm<EditTransactionFormValues>({
        resolver: zodResolver(editTransactionSchema),
        defaultValues: {
            name: "",
            amount: "",
            categoryId: "",
            date: "",
            // type: "expense",
        },
    });

    const nameValue = form.watch("name");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(nameValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [nameValue]);

    useEffect(() => {
        if (transaction) {
            let catId = transaction.categoryId || "";

            // Check if category is an object and use its ID if transaction.categoryId is missing
            if (!catId && typeof transaction.category === 'object' && transaction.category !== null) {
                catId = (transaction.category as any).id || "";
            }

            // Fallback to name matching if we still don't have an ID (or if category was a string name)
            if (!catId && categories) {
                const catName = (typeof transaction.category === 'object' && transaction.category !== null)
                    ? (transaction.category as any).name
                    : transaction.category;

                if (catName) {
                    catId = categories.find(c => c.name === catName)?.id ||
                        categories.find(c => c.name.toLowerCase() === catName.toLowerCase())?.id ||
                        "";
                }
            }

            form.reset({
                name: transaction.name,
                amount: transaction.amount.toString(),
                categoryId: catId,
                date: transaction.date ? transaction.date.split('T')[0] : "",
                // type: transaction.type,
            });
        }
    }, [transaction, categories, form]);

    const onSubmit = async (data: EditTransactionFormValues) => {
        if (!transaction) return;

        try {
            await updateTransaction.mutateAsync({
                id: transaction.id,
                name: data.name,
                amount: parseFloat(data.amount),
                categoryId: data.categoryId,
                date: new Date(data.date).toISOString(),
                // type: data.type,
            });
            toast.success("Transaction updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update transaction");
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col">
                                            <Input placeholder="Transaction name" {...field} />
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
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={transaction?.category || "Select category"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories?.map((cat) => (
                                                <SelectItem className="capitalize" key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={updateTransaction.isPending}
                            >
                                {updateTransaction.isPending ? "Updating..." : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

                <MergeConfirmationModal
                    isOpen={isMergeModalOpen}
                    onClose={() => setIsMergeModalOpen(false)}
                    suggestions={suggestions}
                    onMerge={handleMerge}
                    isMerging={mergeTransactions.isPending}
                />
            </DialogContent>
        </Dialog>
    );
}
