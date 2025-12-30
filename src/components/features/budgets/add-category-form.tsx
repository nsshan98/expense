"use client";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { useCreateCategory } from "@/hooks/use-categories";
import { useCreateBudget } from "@/hooks/use-budgets";
import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select";
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
import { addCategoryFormSchema, AddCategoryFormValues } from "@/zod/category-schema";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/atoms/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { MonthPicker } from "@/components/atoms/month-picker";
import { useCurrency } from "@/contexts/currency-context";

export function AddCategoryForm() {
    const createCategory = useCreateCategory();
    const createBudget = useCreateBudget();
    const { symbol } = useCurrency();

    const form = useForm<AddCategoryFormValues>({
        resolver: zodResolver(addCategoryFormSchema),
        defaultValues: {
            name: "",
            type: "EXPENSE",
            amount: "",
        },
    });

    const onSubmit = async (data: AddCategoryFormValues) => {
        try {
            if (data.amount && parseFloat(data.amount) > 0) {
                // 1. Create Budget with Category (Option B)
                await createBudget.mutateAsync({
                    categoryName: data.name,
                    categoryType: data.type,
                    amount: parseFloat(data.amount),
                    month: data.month ? format(data.month, "MM-yyyy") : undefined,
                });
                toast.success("Category and budget created successfully");
            } else {
                // 2. Create Category only
                await createCategory.mutateAsync({
                    name: data.name,
                    type: data.type,
                });
                toast.success("Category created successfully");
            }

            form.reset({
                name: "",
                type: "EXPENSE",
                amount: "",
                month: undefined,
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to create category/budget");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Utilities"
                                            className="bg-muted/50"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full bg-muted/50">
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
                                    <FormLabel>Monthly Budget (Optional)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{symbol}</span>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="pl-6 bg-muted/50"
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
                                    <FormLabel>Budget Month (Optional)</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal text-amber-900 dark:text-amber-50",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "MMMM yyyy")
                                                    ) : (
                                                        <span className="text-amber-900 dark:text-amber-50">Pick a month</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <MonthPicker
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                            disabled={createCategory.isPending || createBudget.isPending}
                        >
                            {(createCategory.isPending || createBudget.isPending) ? "Creating..." : "Create"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
