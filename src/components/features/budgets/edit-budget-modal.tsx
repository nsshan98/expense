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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/atoms/form";
import { editBudgetSchema, EditBudgetFormValues } from "@/zod/budget-schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { MonthPicker } from "@/components/atoms/month-picker";

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
            categoryType: "EXPENSE",
            amount: "",
            month: undefined,
        },
    });

    useEffect(() => {
        if (budget) {
            // Attempt to parse existing month from budget if it exists, otherwise default or skip
            // Assuming budget has a Month field? The Budget interface doesn't explicitly show it in previous context,
            // but the GET /all endpoint implies it might be relevant. Checking types/dashboard.ts would confirm.
            // For now, if budget doesn't have a specific month field we can use, we might default to current or leave empty.
            // However, the user request says 'while edit the budet add type and month also'. 
            // So we need to be able to set it.

            form.reset({
                categoryName: budget.category.name,
                categoryType: (budget.category.type as "EXPENSE" | "INCOME") || "EXPENSE",
                amount: budget.amount.toString(),
                month: budget.month,
            });
        }
    }, [budget, form]);

    const onSubmit = async (data: EditBudgetFormValues) => {
        if (!budget) return;

        try {
            const amountValue = parseFloat(data.amount);

            // 1. Update Budget (Amount Only)
            // We update if amount changed
            if (amountValue !== budget.amount) {
                await updateBudget.mutateAsync({
                    id: budget.id,
                    amount: amountValue,
                });
            }

            // 2. Update Category (Name and Type)
            if (budget.categoryId) {
                if (data.categoryName !== budget.category.name || data.categoryType !== budget.category.type) {
                    await updateCategory.mutateAsync({
                        id: budget.categoryId,
                        name: data.categoryName,
                        type: data.categoryType
                    });
                }
            } else if (data.categoryName !== budget.category.name) {
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
                                        <Input placeholder="Category name" className="capitalize" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="EXPENSE">Expense</SelectItem>
                                            <SelectItem value="INCOME">Income</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
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

                        <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Budget Month (Cannot be changed)</FormLabel>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            disabled
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                field.value
                                            ) : (
                                                <span>Pick a month</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
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
