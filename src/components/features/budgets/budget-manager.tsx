"use client";

import { BudgetList } from "@/components/features/budgets/budget-list";
import { useBudgets, useUpdateBudget } from "@/hooks/use-budgets";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function BudgetManager() {
    const { data: budgets, isLoading } = useBudgets();
    const updateBudget = useUpdateBudget();
    const [localBudgets, setLocalBudgets] = useState<Record<string, string>>({});

    // Initialize local state when budgets are loaded
    useEffect(() => {
        if (budgets) {
            const initialState: Record<string, string> = {};
            budgets.forEach(b => {
                initialState[b.id] = b.amount.toString();
            });
            setLocalBudgets(initialState);
        }
    }, [budgets]);

    const handleAmountChange = (id: string, value: string) => {
        setLocalBudgets(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async (id: string) => {
        const amount = parseFloat(localBudgets[id]);
        if (isNaN(amount)) {
            toast.error("Invalid amount");
            return;
        }

        try {
            await updateBudget.mutateAsync({ id, amount });
            toast.success("Budget updated");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update budget");
        }
    };

    return (
        <BudgetList
            budgets={budgets}
            isLoading={isLoading}
            localBudgets={localBudgets}
            onAmountChange={handleAmountChange}
            onSave={handleSave}
            isUpdating={updateBudget.isPending}
        />
    );
}
