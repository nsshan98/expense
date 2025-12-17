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

export function AddCategoryForm() {
    const createCategory = useCreateCategory();
    const createBudget = useCreateBudget();

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
            // 1. Create Category
            const categoryResponse = await createCategory.mutateAsync({
                name: data.name,
                type: data.type
            });

            const categoryId = categoryResponse.id || (categoryResponse as any).data?.id;

            if (!categoryId) {
                throw new Error("Failed to retrieve category ID");
            }

            // 2. Create Budget (if amount is provided)
            if (data.amount && parseFloat(data.amount) > 0) {
                await createBudget.mutateAsync({
                    categoryId: categoryId,
                    amount: parseFloat(data.amount),
                });
                toast.success("Category and budget created successfully");
            } else {
                toast.success("Category created successfully");
            }

            form.reset({
                name: "",
                type: "EXPENSE",
                amount: "",
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
                                            <SelectTrigger className="bg-muted/50">
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
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
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
