"use client";

import { BudgetList } from "@/components/features/budgets/budget-list";
import { useBudgets, useUpdateBudget } from "@/hooks/use-budgets";
import { useState, useEffect } from "react";
import { Budget } from "@/types/dashboard";
import { DeleteBudgetModal } from "./delete-budget-modal";
import { EditBudgetModal } from "./edit-budget-modal";
import { toast } from "sonner";

export function BudgetManager() {
    const { data: budgets, isLoading } = useBudgets();
    const updateBudget = useUpdateBudget();
    const [localBudgets, setLocalBudgets] = useState<Record<string, string>>({});
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

    const handleDeleteClick = (id: string) => {
        const budget = budgets?.find(b => b.id === id);
        if (budget) {
            setSelectedBudget(budget);
            setIsDeleteModalOpen(true);
        }
    };

    const handleEditClick = (id: string) => {
        const budget = budgets?.find(b => b.id === id);
        if (budget) {
            setSelectedBudget(budget);
            setIsEditModalOpen(true);
        }
    };

    return (
        <>
            <BudgetList
                budgets={budgets}
                isLoading={isLoading}
                localBudgets={localBudgets}
                onAmountChange={handleAmountChange}
                onSave={handleSave}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
                isUpdating={updateBudget.isPending}
            />
            <DeleteBudgetModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                budget={selectedBudget}
            />
            <EditBudgetModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                budget={selectedBudget}
            />
        </>
    );
}
