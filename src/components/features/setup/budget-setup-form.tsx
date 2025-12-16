"use client";

import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { useState } from "react";
import { useCreateCategory } from "@/hooks/use-categories";
import { useBudgets, useCreateBudget } from "@/hooks/use-budgets";
import { toast } from "sonner";
import { Utensils, Bus, ShoppingBag, Home, Coffee, Zap, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface BudgetItem {
    id: string;
    category: string;
    amount: string;
    icon: React.ReactNode;
}

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

    const [budgets, setBudgets] = useState<BudgetItem[]>(
        defaultCategories.map((cat, idx) => ({
            id: `default-${idx}`,
            ...cat,
        }))
    );

    const handleAmountChange = (id: string, value: string) => {
        setBudgets(prev =>
            prev.map(b => b.id === id ? { ...b, amount: value } : b)
        );
    };

    const handleAddCustom = () => {
        const newBudget: BudgetItem = {
            id: `custom-${Date.now()}`,
            category: "",
            amount: "0",
            icon: <Plus className="h-5 w-5 text-muted-foreground" />,
        };
        setBudgets(prev => [...prev, newBudget]);
    };

    const handleRemove = (id: string) => {
        setBudgets(prev => prev.filter(b => b.id !== id));
    };

    const handleCategoryNameChange = (id: string, value: string) => {
        setBudgets(prev =>
            prev.map(b => b.id === id ? { ...b, category: value } : b)
        );
    };

    const handleContinue = async () => {
        // Validate all budgets
        const validBudgets = budgets.filter(b => b.category && parseFloat(b.amount) > 0);

        if (validBudgets.length === 0) {
            toast.error("Please add at least one budget");
            return;
        }

        try {
            // Create categories first, then budgets
            for (const budget of validBudgets) {
                // Create category
                const categoryResponse = await createCategory.mutateAsync({
                    name: budget.category,
                });

                // Create budget with amount
                await createBudget.mutateAsync({
                    category: budget.category,
                    amount: parseFloat(budget.amount),
                });
            }

            toast.success("Budgets created successfully!");
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create budgets");
        }
    };

    const handleBack = () => {
        router.back();
    };

    // If budgets already exist, redirect to dashboard
    if (existingBudgets && existingBudgets.length > 0) {
        router.push("/dashboard");
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <Card className="w-full max-w-md p-8">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Set your monthly budgets</h1>
                        <p className="text-muted-foreground mt-2">Helps us predict and warn you early.</p>
                    </div>

                    <div className="space-y-4">
                        {budgets.map((budget) => (
                            <div key={budget.id} className="space-y-2">
                                {budget.id.startsWith('custom-') ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Category name"
                                            value={budget.category}
                                            onChange={(e) => handleCategoryNameChange(budget.id, e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemove(budget.id)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="text-sm font-medium text-foreground">{budget.category}</label>
                                )}

                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        {budget.icon}
                                    </div>
                                    <Input
                                        type="number"
                                        value={budget.amount}
                                        onChange={(e) => handleAmountChange(budget.id, e.target.value)}
                                        className="pl-12 bg-muted/50 border-border text-lg font-medium"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        ))}

                        <Button
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
                            variant="outline"
                            onClick={handleBack}
                            className="flex-1"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleContinue}
                            disabled={createCategory.isPending || createBudget.isPending}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {(createCategory.isPending || createBudget.isPending) ? "Creating..." : "Continue"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
