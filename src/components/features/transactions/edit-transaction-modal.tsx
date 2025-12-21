"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useUpdateTransaction } from "@/hooks/use-transactions";
import { Transaction } from "@/types/dashboard";
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
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

    useEffect(() => {
        if (transaction) {
            const catId = transaction.categoryId ||
                categories?.find(c => c.name === transaction.category)?.id ||
                categories?.find(c => c.name.toLowerCase() === transaction.category?.toLowerCase())?.id ||
                "";

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
                                        <Input placeholder="Transaction name" {...field} />
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
                        {/* Hidden/Disabled Type field handled internally or via form but UI requested to be commented out or simple */}
                        {/* <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem className="hidden">
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="expense">Expense</SelectItem>
                                            <SelectItem value="income">Income</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        /> */}

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
            </DialogContent>
        </Dialog>
    );
}
