"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { useUpdateBudget } from "@/hooks/use-budgets";
import { useUpdateCategory } from "@/hooks/use-categories";
import { Budget } from "@/types/dashboard";
import { useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/atoms/form";
import { editBudgetSchema, EditBudgetFormValues } from "@/zod/budget-schema";

interface EditBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    budget: Budget | null;
}

export function EditBudgetModal({ isOpen, onClose, budget }: EditBudgetModalProps) {
    const updateBudget = useUpdateBudget();
    const updateCategory = useUpdateCategory();

    const form = useForm<EditBudgetFormValues>({
        resolver: zodResolver(editBudgetSchema),
        defaultValues: {
            categoryName: "",
            amount: "",
        },
    });

    useEffect(() => {
        if (budget) {
            form.reset({
                categoryName: budget.category,
                amount: budget.amount.toString(),
            });
        }
    }, [budget, form]);

    const onSubmit = async (data: EditBudgetFormValues) => {
        if (!budget) return;

        try {
            const amountValue = parseFloat(data.amount);

            // 1. Update Budget Amount
            if (amountValue !== budget.amount) {
                await updateBudget.mutateAsync({
                    id: budget.id,
                    amount: amountValue,
                });
            }

            // 2. Update Category Name (if changed and categoryId exists)
            if (budget.categoryId && data.categoryName !== budget.category) {
                await updateCategory.mutateAsync({
                    id: budget.categoryId,
                    name: data.categoryName,
                    // We might need to pass the type if it's required by the API, 
                    // but for now we assume we are just updating the name. 
                    // If type is required, we should probably fetch the category details first or store it in budget.
                    // Assuming type is optional in update or we default to EXPENSE if not provided (though that might be risky).
                    // Let's check updateCategorySchema again. It has optional type.
                });
            } else if (data.categoryName !== budget.category) {
                console.warn("Cannot update category name: categoryId is missing");
            }

            toast.success("Budget updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update budget");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Budget</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="categoryName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category name" {...field} />
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
                                    <FormLabel>Budget Amount</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                            <Input
                                                type="number"
                                                className="pl-6"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </div>
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
                                disabled={updateBudget.isPending || updateCategory.isPending}
                            >
                                {(updateBudget.isPending || updateCategory.isPending) ? "Updating..." : "Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
