"use client";

import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useCreateCategory } from "@/hooks/use-categories";
import { useBudgets, useCreateBudget } from "@/hooks/use-budgets";
import { toast } from "sonner";
import { Utensils, Bus, ShoppingBag, Home, Coffee, Zap, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
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
import { budgetSetupSchema, BudgetSetupFormValues } from "@/zod/budget-schema";

const defaultCategories = [
    { category: "Food", icon: <Utensils className="h-5 w-5 text-primary" />, amount: "10000" },
    { category: "Transport", icon: <Bus className="h-5 w-5 text-primary" />, amount: "3000" },
    { category: "Shopping", icon: <ShoppingBag className="h-5 w-5 text-primary" />, amount: "8000" },
    { category: "Utilities", icon: <Zap className="h-5 w-5 text-primary" />, amount: "5000" },
    { category: "Housing", icon: <Home className="h-5 w-5 text-primary" />, amount: "15000" },
    { category: "Entertainment", icon: <Coffee className="h-5 w-5 text-primary" />, amount: "4000" },
];

export function BudgetSetupForm() {
    const router = useRouter();
    const createCategory = useCreateCategory();
    const createBudget = useCreateBudget();
    const { data: existingBudgets } = useBudgets();

    const form = useForm<BudgetSetupFormValues>({
        resolver: zodResolver(budgetSetupSchema),
        defaultValues: {
            budgets: defaultCategories.map((cat, idx) => ({
                id: `default-${idx}`,
                category: cat.category,
                amount: cat.amount,
                isCustom: false,
            })),
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "budgets",
    });

    const handleAddCustom = () => {
        append({
            id: `custom-${Date.now()}`,
            category: "",
            amount: "0",
            isCustom: true,
        });
    };

    const onSubmit = async (data: BudgetSetupFormValues) => {
        // Validate all budgets
        const validBudgets = data.budgets.filter(b => b.category && parseFloat(b.amount) > 0);

        if (validBudgets.length === 0) {
            toast.error("Please add at least one budget with a valid amount");
            return;
        }

        try {
            // Create categories first, then budgets
            for (const budget of validBudgets) {
                // Create category
                const categoryResponse = await createCategory.mutateAsync({
                    name: budget.category,
                    type: "EXPENSE",
                });

                // The response from createCategory should contain the ID
                // Assuming categoryResponse is the category object with an id
                // If the API returns { data: Category } or just Category, we need to handle it.
                // Based on use-categories.ts: return data; which is likely the category object or { data: ... }
                // Let's assume it returns the category object directly or we need to check the structure.
                // Looking at use-categories.ts: const { data } = await axiosClient.post(...) -> return data;
                // If the backend follows standard REST, it returns the created resource.

                const categoryId = categoryResponse.id || (categoryResponse as any).data?.id;

                if (categoryId) {
                    // Create budget with amount and categoryId
                    await createBudget.mutateAsync({
                        categoryId: categoryId,
                        amount: parseFloat(budget.amount),
                    });
                } else {
                    console.error("Failed to get category ID for", budget.category);
                }
            }

            toast.success("Budgets created successfully!");
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create budgets");
        }
    };

    // If budgets already exist, redirect to dashboard
    if (existingBudgets && existingBudgets.length > 0) {
        router.push("/dashboard");
        return null;
    }

    const getIcon = (index: number, isCustom?: boolean) => {
        if (isCustom) return <Plus className="h-5 w-5 text-muted-foreground" />;
        return defaultCategories[index]?.icon || <Plus className="h-5 w-5 text-muted-foreground" />;
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md p-8">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Set your monthly budgets</h1>
                        <p className="text-muted-foreground mt-2">Helps us predict and warn you early.</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="space-y-2">
                                        {field.isCustom ? (
                                            <div className="flex items-center gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`budgets.${index}.category`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input placeholder="Category name" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <label className="text-sm font-medium text-foreground">
                                                {form.getValues(`budgets.${index}.category`)}
                                            </label>
                                        )}

                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                {getIcon(index, field.isCustom)}
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name={`budgets.${index}.amount`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                className="pl-12 bg-muted/50 border-border text-lg font-medium"
                                                                placeholder="0"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddCustom}
                                    className="w-full border-dashed border-2 text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Custom Category
                                </Button>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="flex-1"
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createCategory.isPending || createBudget.isPending}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    {(createCategory.isPending || createBudget.isPending) ? "Creating..." : "Continue"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </Card>
        </div>
    );
}
